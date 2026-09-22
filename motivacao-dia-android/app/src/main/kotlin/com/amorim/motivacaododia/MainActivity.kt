package com.amorim.motivacaododia

import android.Manifest
import android.app.NotificationManager
import android.app.TimePickerDialog
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.amorim.motivacaododia.alarm.AlarmScheduler
import com.amorim.motivacaododia.core.Fonte
import com.amorim.motivacaododia.core.Passagem
import com.amorim.motivacaododia.core.SelecaoDiaria
import com.amorim.motivacaododia.data.ConfiguracoesRepository
import com.amorim.motivacaododia.data.Horario
import com.amorim.motivacaododia.data.MensagensBoaNoite
import com.amorim.motivacaododia.data.MotivacaoRepository
import com.amorim.motivacaododia.ui.theme.MotivacaoDoDiaTheme
import com.amorim.motivacaododia.ui.theme.corAcentoFonte
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class MainActivity : ComponentActivity() {

    private lateinit var repositorio: MotivacaoRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        repositorio = MotivacaoRepository(applicationContext)

        setContent {
            MotivacaoDoDiaTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    TelaPrincipal(repositorio = repositorio)
                }
            }
        }
    }

}

private data class EstadoTela(
    val passagem: Passagem? = null,
    val horario: Horario = Horario(ConfiguracoesRepository.HORA_PADRAO, ConfiguracoesRepository.MINUTO_PADRAO),
    val proximoAlarme: String = "—",
    val notificacoesPermitidas: Boolean = true,
    val alarmesExatosPermitidos: Boolean = true,
    val bateriaOtimizacaoIgnorada: Boolean = false,
    val telaCheiaPermitida: Boolean = true,
)

private fun saudacaoAtual(hora: Int = LocalTime.now().hour): String = when (hora) {
    in 5..11 -> "Bom dia"
    in 12..17 -> "Boa tarde"
    else -> "Boa noite"
}

private fun mensagemBoaNoiteDeHoje(): String {
    val lista = MensagensBoaNoite.lista
    val indice = SelecaoDiaria.indiceParaHoje(LocalDate.now().dayOfYear, lista.size)
    return lista[indice]
}

@Composable
private fun TelaPrincipal(repositorio: MotivacaoRepository) {
    val context = LocalContext.current
    val escopo = rememberCoroutineScope()
    var estado by remember { mutableStateOf(EstadoTela()) }
    val mensagemNoite = remember { mensagemBoaNoiteDeHoje() }

    fun atualizarStatusPermissoes() {
        val notificacoesOk = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) ==
                android.content.pm.PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
        val alarmesOk = AlarmScheduler.podeAgendarAlarmesExatos(context)
        val powerManager = context.getSystemService(PowerManager::class.java)
        val bateriaOk = powerManager?.isIgnoringBatteryOptimizations(context.packageName) ?: true
        val telaCheiaOk = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            context.getSystemService(NotificationManager::class.java)?.canUseFullScreenIntent() ?: true
        } else {
            true
        }
        val proximo = AlarmScheduler.proximoAlarmeAgendadoEm(context)?.let(::formatarInstante) ?: "—"
        estado = estado.copy(
            notificacoesPermitidas = notificacoesOk,
            alarmesExatosPermitidos = alarmesOk,
            bateriaOtimizacaoIgnorada = bateriaOk,
            telaCheiaPermitida = telaCheiaOk,
            proximoAlarme = proximo,
        )
    }

    val lancadorPermissaoNotificacao = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { atualizarStatusPermissoes() }

    // ACTION_REQUEST_SCHEDULE_EXACT_ALARM, ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS e
    // ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT não devolvem um resultado usável; usamos
    // StartActivityForResult só para saber QUANDO o usuário voltou dessa tela e
    // reconsultar o status real via atualizarStatusPermissoes().
    val lancadorConfiguracoesSistema = rememberLauncherForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { atualizarStatusPermissoes() }

    LaunchedEffect(Unit) {
        val passagem = repositorio.passagemDeHoje()
        val horario = repositorio.horarioConfigurado()
        estado = estado.copy(passagem = passagem, horario = horario)
        // Garante que o alarme exista mesmo se o app nunca tiver sido aberto desde a
        // instalação, ou se o processo do sistema tiver descartado o alarme anterior.
        // setAlarmClock() é idempotente: chamar de novo só reafirma o mesmo próximo horário.
        AlarmScheduler.agendarProximoDisparo(context, horario)
        atualizarStatusPermissoes()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .verticalScroll(rememberScrollState())
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Column {
            Text(
                text = saudacaoAtual(),
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = stringResource(R.string.app_name),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }

        CartaoPassagemDoDia(estado.passagem)

        CartaoInfo(titulo = "Próximo alarme", valor = estado.proximoAlarme)

        CartaoHorario(
            horario = estado.horario,
            onEditar = {
                TimePickerDialog(
                    context,
                    { _, hora, minuto ->
                        escopo.launch {
                            repositorio.salvarHorario(hora, minuto)
                            val novoHorario = Horario(hora, minuto)
                            estado = estado.copy(horario = novoHorario)
                            AlarmScheduler.agendarProximoDisparo(context, novoHorario)
                            atualizarStatusPermissoes()
                        }
                    },
                    estado.horario.hora,
                    estado.horario.minuto,
                    true,
                ).show()
            },
        )

        CartaoBoaNoite(mensagemNoite)

        Text(text = "Permissões", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

        LinhaPermissao(
            titulo = "Notificações",
            concedida = estado.notificacoesPermitidas,
            textoBotao = "Permitir",
            onCorrigir = {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    lancadorPermissaoNotificacao.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            },
        )

        LinhaPermissao(
            titulo = "Alarmes exatos",
            concedida = estado.alarmesExatosPermitidos,
            textoBotao = "Ajustar",
            onCorrigir = {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    lancadorConfiguracoesSistema.launch(
                        Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                            data = Uri.parse("package:${context.packageName}")
                        },
                    )
                }
            },
        )

        LinhaPermissao(
            titulo = "Ignorar otimização de bateria",
            concedida = estado.bateriaOtimizacaoIgnorada,
            textoBotao = "Ajustar",
            onCorrigir = {
                lancadorConfiguracoesSistema.launch(
                    Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                        data = Uri.parse("package:${context.packageName}")
                    },
                )
            },
        )

        LinhaPermissao(
            titulo = "Alarme em tela cheia",
            concedida = estado.telaCheiaPermitida,
            textoBotao = "Ajustar",
            onCorrigir = {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    lancadorConfiguracoesSistema.launch(
                        Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT).apply {
                            data = Uri.parse("package:${context.packageName}")
                        },
                    )
                }
            },
        )

        AvisoFabricante()

        Button(
            onClick = {
                AlarmScheduler.agendarTeste(context, segundos = 10)
            },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Testar alarme (toca em 10s)")
        }
    }
}

@Composable
private fun CartaoPassagemDoDia(passagem: Passagem?) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(modifier = Modifier.height(IntrinsicSize.Min)) {
            Box(
                modifier = Modifier
                    .width(6.dp)
                    .fillMaxHeight()
                    .background(if (passagem != null) corAcentoFonte(passagem.fonte) else MaterialTheme.colorScheme.outline),
            )
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = when (passagem?.fonte) {
                        Fonte.BIBLIA -> "Passagem de hoje · Bíblia"
                        Fonte.MARCO_AURELIO -> "Passagem de hoje · Meditações"
                        null -> "Carregando a passagem de hoje…"
                    },
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                if (passagem != null) {
                    Text(text = passagem.texto, style = MaterialTheme.typography.bodyLarge)
                    Text(
                        text = "— ${passagem.referencia}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = corAcentoFonte(passagem.fonte),
                    )
                }
            }
        }
    }
}

@Composable
private fun CartaoBoaNoite(mensagem: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = "Antes de dormir",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = FontWeight.Bold,
            )
            Text(text = mensagem, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

@Composable
private fun CartaoInfo(titulo: String, valor: String) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(titulo, style = MaterialTheme.typography.bodyLarge)
            Text(valor, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun CartaoHorario(horario: Horario, onEditar: () -> Unit) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column {
                Text("Horário do alarme", style = MaterialTheme.typography.bodyLarge)
                Text(
                    horario.formatado(),
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                )
            }
            Button(onClick = onEditar) {
                Text("Alterar")
            }
        }
    }
}

@Composable
private fun LinhaPermissao(
    titulo: String,
    concedida: Boolean,
    textoBotao: String,
    onCorrigir: () -> Unit,
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Column {
                Text(titulo, style = MaterialTheme.typography.bodyLarge)
                Text(
                    if (concedida) "Concedida" else "Pendente",
                    color = if (concedida) VerdeStatus else VermelhoStatus,
                    fontWeight = FontWeight.Bold,
                )
            }
            if (!concedida) {
                Button(onClick = onCorrigir) {
                    Text(textoBotao)
                }
            }
        }
    }
}

@Composable
private fun AvisoFabricante() {
    val context = LocalContext.current
    val fabricante = Build.MANUFACTURER
    val slug = fabricante.lowercase().replace(" ", "-")
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                "Fabricante detectado: $fabricante",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold,
            )
            Text(
                "Alguns fabricantes matam apps em segundo plano de forma agressiva. " +
                    "Veja como evitar isso para o seu aparelho:",
                style = MaterialTheme.typography.bodyMedium,
            )
            Button(
                onClick = {
                    context.startActivity(
                        Intent(Intent.ACTION_VIEW, Uri.parse("https://dontkillmyapp.com/$slug")),
                    )
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text("Abrir dontkillmyapp.com/$slug")
            }
        }
    }
}

private fun formatarInstante(epochMillis: Long): String {
    val zoneId = ZoneId.systemDefault()
    val dataHora = Instant.ofEpochMilli(epochMillis).atZone(zoneId)
    return dataHora.format(DateTimeFormatter.ofPattern("dd/MM 'às' HH:mm"))
}

private val VerdeStatus = Color(0xFF2E7D32)
private val VermelhoStatus = Color(0xFFC62828)
