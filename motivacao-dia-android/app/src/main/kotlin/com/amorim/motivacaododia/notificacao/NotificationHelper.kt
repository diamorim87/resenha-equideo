package com.amorim.motivacaododia.notificacao

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.amorim.motivacaododia.MainActivity
import com.amorim.motivacaododia.R
import com.amorim.motivacaododia.core.Passagem

/**
 * Canal "Motivação diária" (importância HIGH) e a notificação com BigTextStyle
 * para a passagem ficar legível na barra de notificações sem precisar abrir o app.
 */
class NotificationHelper(private val context: Context) {

    init {
        criarCanalSeNecessario()
    }

    fun mostrar(passagem: Passagem) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            REQUEST_CODE_ABRIR_APP,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val corpo = "${passagem.texto}\n— ${passagem.referencia}"

        val notificacao = NotificationCompat.Builder(context, CANAL_ID)
            .setSmallIcon(R.drawable.ic_notificacao)
            .setContentTitle(context.getString(R.string.notificacao_titulo))
            .setContentText(corpo)
            .setStyle(NotificationCompat.BigTextStyle().bigText(corpo))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        NotificationManagerCompat.from(context).notify(ID_NOTIFICACAO, notificacao)
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
        }
        manager.createNotificationChannel(canal)
    }

    companion object {
        const val CANAL_ID = "motivacao_diaria"
        private const val ID_NOTIFICACAO = 2001
        private const val REQUEST_CODE_ABRIR_APP = 3001
    }
}
