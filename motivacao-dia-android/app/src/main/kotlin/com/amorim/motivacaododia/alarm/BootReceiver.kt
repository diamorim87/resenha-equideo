package com.amorim.motivacaododia.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * AlarmManager perde os alarmes agendados quando o aparelho reinicia, e a hora
 * "certa" pode mudar se o usuário ajustar o relógio ou o fuso horário. Reagendamos
 * nesses quatro casos para o app continuar funcionando sem exigir que o usuário
 * volte a abrir a tela.
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            Intent.ACTION_TIME_CHANGED,
            Intent.ACTION_TIMEZONE_CHANGED,
            -> AlarmScheduler.agendarProximoDisparoBloqueante(context)
        }
    }
}
