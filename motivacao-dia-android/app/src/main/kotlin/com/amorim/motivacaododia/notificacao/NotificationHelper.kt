package com.amorim.motivacaododia.notificacao

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import androidx.core.app.NotificationCompat
import com.amorim.motivacaododia.R
import com.amorim.motivacaododia.alarm.AlarmActivity
import com.amorim.motivacaododia.core.Passagem

/**
 * Canal "Alarme diário" (IMPORTANCE_HIGH, sem som/vibração próprios do canal — quem
 * toca o som e vibra é o AlarmRingService via MediaPlayer/Vibrator, para poder tocar
 * em loop no volume de alarme). A notificação serve dois papéis: é o fullScreenIntent
 * que abre AlarmActivity, e é a notificação exigida por um foreground service.
 */
class NotificationHelper(private val context: Context) {

    init {
        criarCanalSeNecessario()
    }

    fun criarNotificacaoAlarme(passagem: Passagem): Notification {
        val pendingIntent = PendingIntent.getActivity(
            context,
            REQUEST_CODE_ALARME,
            AlarmActivity.criarIntent(context, passagem),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val corpo = "${passagem.texto}\n— ${passagem.referencia}"

        return NotificationCompat.Builder(context, CANAL_ID)
            .setSmallIcon(R.drawable.ic_notificacao)
            .setContentTitle(context.getString(R.string.notificacao_titulo))
            .setContentText(corpo)
            .setStyle(NotificationCompat.BigTextStyle().bigText(corpo))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .setFullScreenIntent(pendingIntent, true)
            .build()
    }

    private fun criarCanalSeNecessario() {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (manager.getNotificationChannel(CANAL_ID) != null) return

        val canal = NotificationChannel(
            CANAL_ID,
            context.getString(R.string.canal_notificacao_nome),
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = context.getString(R.string.canal_notificacao_descricao)
            setSound(null, null)
            enableVibration(false)
        }
        manager.createNotificationChannel(canal)
    }

    companion object {
        const val CANAL_ID = "alarme_diario"
        const val ID_NOTIFICACAO = 2001
        private const val REQUEST_CODE_ALARME = 3001
    }
}
