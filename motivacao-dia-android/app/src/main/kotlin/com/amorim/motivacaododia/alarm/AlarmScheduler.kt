package com.amorim.motivacaododia.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.amorim.motivacaododia.MainActivity
import com.amorim.motivacaododia.data.ConfiguracoesRepository
import com.amorim.motivacaododia.data.Horario
import kotlinx.coroutines.runBlocking
import java.time.LocalDateTime
import java.time.ZoneId

/**
 * Agendamento com AlarmManager.setAlarmClock(), que dispara mesmo em Doze e com o
 * aparelho no bolso, porque é tratado pelo sistema como um alarme de despertador
 * visível ao usuário (por isso também não exige a permissão SCHEDULE_EXACT_ALARM,
 * embora a tela do app ainda a verifique e ofereça corrigir, como pedido).
 * setRepeating()/WorkManager não são usados aqui de propósito: são imprecisos e
 * podem atrasar o disparo em minutos ou até horas sob Doze.
 */
object AlarmScheduler {

    private const val REQUEST_CODE_ALARME = 1001
    private const val REQUEST_CODE_TESTE = 1002

    fun agendarProximoDisparo(context: Context, horario: Horario) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val proximoDisparo = calcularProximoDisparo(horario)
        val triggerMillis = proximoDisparo.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        agendarAlarmClock(context, alarmManager, triggerMillis, REQUEST_CODE_ALARME, ehTeste = false)
    }

    /** Usado pelos BroadcastReceivers (boot, fuso, hora), que não estão em um contexto suspend. */
    fun agendarProximoDisparoBloqueante(context: Context) {
        val configuracoes = ConfiguracoesRepository(context.applicationContext)
        val horario = runBlocking { configuracoes.horarioAtual() }
        agendarProximoDisparo(context, horario)
    }

    fun agendarTeste(context: Context, segundos: Long = 10) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val triggerMillis = System.currentTimeMillis() + segundos * 1000
        agendarAlarmClock(context, alarmManager, triggerMillis, REQUEST_CODE_TESTE, ehTeste = true)
    }

    fun podeAgendarAlarmesExatos(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return alarmManager.canScheduleExactAlarms()
    }

    fun proximoAlarmeAgendadoEm(context: Context): Long? {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return alarmManager.nextAlarmClock?.triggerTime
    }

    private fun agendarAlarmClock(
        context: Context,
        alarmManager: AlarmManager,
        triggerMillis: Long,
        requestCode: Int,
        ehTeste: Boolean,
    ) {
        val intentAlarme = Intent(context, AlarmReceiver::class.java).apply {
            putExtra(AlarmReceiver.EXTRA_TESTE, ehTeste)
        }
        val pendingAlarme = PendingIntent.getBroadcast(
            context,
            requestCode,
            intentAlarme,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        val intentMostrar = Intent(context, MainActivity::class.java)
        val pendingMostrar = PendingIntent.getActivity(
            context,
            requestCode,
            intentMostrar,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        alarmManager.setAlarmClock(
            AlarmManager.AlarmClockInfo(triggerMillis, pendingMostrar),
            pendingAlarme,
        )
    }

    internal fun calcularProximoDisparo(
        horario: Horario,
        agora: LocalDateTime = LocalDateTime.now(),
    ): LocalDateTime {
        var candidato = agora
            .withHour(horario.hora)
            .withMinute(horario.minuto)
            .withSecond(0)
            .withNano(0)
        if (!candidato.isAfter(agora)) {
            candidato = candidato.plusDays(1)
        }
        return candidato
    }
}
