package com.amorim.motivacaododia.alarm

import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import com.amorim.motivacaododia.core.Fonte
import com.amorim.motivacaododia.core.Passagem
import com.amorim.motivacaododia.notificacao.NotificationHelper

/**
 * Toca o som (volume de alarme, em loop) e vibra como um foreground service.
 * Isso é necessário porque o fullScreenIntent só abre a AlarmActivity sozinho
 * quando o aparelho está bloqueado/com a tela apagada; com a tela acesa o Android
 * só mostra uma notificação heads-up, e o alarme precisa continuar tocando mesmo
 * assim. Iniciar um foreground service a partir do BroadcastReceiver de um
 * AlarmManager.setAlarmClock() é uma das exceções documentadas às restrições de
 * início de serviços em segundo plano do Android.
 */
class AlarmRingService : Service() {

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACAO_PARAR) {
            pararTudo()
            stopSelf()
            return START_NOT_STICKY
        }

        val passagem = Passagem(
            texto = intent?.getStringExtra(EXTRA_TEXTO).orEmpty(),
            referencia = intent?.getStringExtra(EXTRA_REFERENCIA).orEmpty(),
            fonte = Fonte.valueOf(intent?.getStringExtra(EXTRA_FONTE) ?: Fonte.BIBLIA.name),
        )
        startForeground(NotificationHelper.ID_NOTIFICACAO, NotificationHelper(this).criarNotificacaoAlarme(passagem))
        tocarEVibrar()
        return START_NOT_STICKY
    }

    private fun tocarEVibrar() {
        try {
            val uriAlarme = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build(),
                )
                setDataSource(this@AlarmRingService, uriAlarme)
                isLooping = true
                prepare()
                start()
            }
        } catch (erro: Exception) {
            Log.w("AlarmRingService", "Não foi possível tocar o som do alarme", erro)
        }

        vibrator = getSystemService(Vibrator::class.java)
        val padrao = longArrayOf(0, 800, 400, 800, 400)
        vibrator?.vibrate(VibrationEffect.createWaveform(padrao, 0))
    }

    private fun pararTudo() {
        mediaPlayer?.apply {
            runCatching { stop() }
            release()
        }
        mediaPlayer = null
        vibrator?.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    override fun onDestroy() {
        pararTudo()
        super.onDestroy()
    }

    companion object {
        private const val ACAO_PARAR = "com.amorim.motivacaododia.action.PARAR_ALARME"
        private const val EXTRA_TEXTO = "extra_texto"
        private const val EXTRA_REFERENCIA = "extra_referencia"
        private const val EXTRA_FONTE = "extra_fonte"

        fun criarIntent(context: Context, passagem: Passagem): Intent =
            Intent(context, AlarmRingService::class.java).apply {
                putExtra(EXTRA_TEXTO, passagem.texto)
                putExtra(EXTRA_REFERENCIA, passagem.referencia)
                putExtra(EXTRA_FONTE, passagem.fonte.name)
            }

        fun criarIntentParar(context: Context): Intent =
            Intent(context, AlarmRingService::class.java).apply { action = ACAO_PARAR }
    }
}
