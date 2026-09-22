package com.amorim.motivacaododia.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.amorim.motivacaododia.data.MotivacaoRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Dispara ao horário agendado (ou 10s depois, no teste). Inicia o AlarmRingService
 * (som + vibração + notificação em tela cheia) e, se não for um disparo de teste, já
 * agenda o alarme do dia seguinte — é assim que a cadeia de alarmes se mantém sem
 * depender de um serviço rodando o tempo todo em segundo plano.
 */
class AlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val pendingResult = goAsync()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val repositorio = MotivacaoRepository(context)
                val passagem = repositorio.passagemDeHoje()
                ContextCompat.startForegroundService(context, AlarmRingService.criarIntent(context, passagem))

                val ehTeste = intent.getBooleanExtra(EXTRA_TESTE, false)
                if (!ehTeste) {
                    val horario = repositorio.horarioConfigurado()
                    AlarmScheduler.agendarProximoDisparo(context, horario)
                }
            } finally {
                pendingResult.finish()
            }
        }
    }

    companion object {
        const val EXTRA_TESTE = "extra_teste"
    }
}
