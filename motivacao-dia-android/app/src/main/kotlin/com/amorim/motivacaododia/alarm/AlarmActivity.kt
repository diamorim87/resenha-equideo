package com.amorim.motivacaododia.alarm

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.amorim.motivacaododia.core.Fonte
import com.amorim.motivacaododia.core.Passagem
import com.amorim.motivacaododia.ui.theme.MotivacaoDoDiaTheme
import com.amorim.motivacaododia.ui.theme.corAcentoFonte

/** Tela de dispensar o alarme: abre em cima da tela bloqueada, tela cheia, sem barra de ações. */
class AlarmActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        configurarJanelaSobreTelaBloqueada()

        val passagem = Passagem(
            texto = intent.getStringExtra(EXTRA_TEXTO).orEmpty(),
            referencia = intent.getStringExtra(EXTRA_REFERENCIA).orEmpty(),
            fonte = Fonte.valueOf(intent.getStringExtra(EXTRA_FONTE) ?: Fonte.BIBLIA.name),
        )

        setContent {
            MotivacaoDoDiaTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    TelaAlarme(passagem = passagem, aoDispensar = ::dispensarAlarme)
                }
            }
        }
    }

    private fun configurarJanelaSobreTelaBloqueada() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD,
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        getSystemService(KeyguardManager::class.java)?.requestDismissKeyguard(this, null)
    }

    private fun dispensarAlarme() {
        startService(AlarmRingService.criarIntentParar(this))
        finish()
    }

    companion object {
        private const val EXTRA_TEXTO = "extra_texto"
        private const val EXTRA_REFERENCIA = "extra_referencia"
        private const val EXTRA_FONTE = "extra_fonte"

        fun criarIntent(context: Context, passagem: Passagem): Intent =
            Intent(context, AlarmActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                putExtra(EXTRA_TEXTO, passagem.texto)
                putExtra(EXTRA_REFERENCIA, passagem.referencia)
                putExtra(EXTRA_FONTE, passagem.fonte.name)
            }
    }
}

@Composable
private fun TelaAlarme(passagem: Passagem, aoDispensar: () -> Unit) {
    BackHandler(onBack = aoDispensar)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .safeDrawingPadding()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween,
    ) {
        Column(
            modifier = Modifier.padding(top = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            PulsoAlarme()
            Text(
                text = "Tocando…",
                style = MaterialTheme.typography.labelLarge,
                modifier = Modifier.padding(top = 16.dp),
            )
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = passagem.fonte.rotulo,
                style = MaterialTheme.typography.labelLarge,
                color = corAcentoFonte(passagem.fonte),
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = passagem.texto,
                style = MaterialTheme.typography.headlineSmall,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(vertical = 16.dp),
            )
            Text(
                text = "— ${passagem.referencia}",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
            )
        }

        Button(
            onClick = aoDispensar,
            modifier = Modifier
                .fillMaxWidth()
                .height(64.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
        ) {
            Text("Dispensar", style = MaterialTheme.typography.titleMedium)
        }
    }
}

@Composable
private fun PulsoAlarme() {
    val transicao = rememberInfiniteTransition(label = "pulso")
    val escala by transicao.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(900, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "escala",
    )
    Box(
        modifier = Modifier
            .size(96.dp)
            .graphicsLayer { scaleX = escala; scaleY = escala }
            .clip(CircleShape)
            .background(MaterialTheme.colorScheme.primary),
    )
}
