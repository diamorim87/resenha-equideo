package com.amorim.motivacaododia.data

import android.content.Context
import com.amorim.motivacaododia.core.Passagem
import com.amorim.motivacaododia.core.SeletorDiario
import java.time.LocalDate

/**
 * Ponto único de acesso usado tanto pela tela (MainActivity) quanto pelo
 * AlarmReceiver: decide a passagem do dia (avançando a rotação apenas uma vez
 * por dia) e persiste o novo estado.
 */
class MotivacaoRepository(context: Context) {

    private val passagens = PassagemRepository(context.applicationContext)
    private val configuracoes = ConfiguracoesRepository(context.applicationContext)
    private val seletor = SeletorDiario()

    suspend fun passagemDeHoje(hoje: LocalDate = LocalDate.now()): Passagem {
        val estadoAtual = configuracoes.lerEstado()
        val resultado = seletor.passagemDeHoje(
            hoje = hoje,
            estado = estadoAtual,
            listas = passagens.passagensPorFonte(),
        )
        if (resultado.novoEstado != estadoAtual) {
            configuracoes.salvarEstado(resultado.novoEstado)
        }
        return resultado.passagem
    }

    suspend fun horarioConfigurado(): Horario = configuracoes.horarioAtual()

    suspend fun salvarHorario(hora: Int, minuto: Int) = configuracoes.salvarHorario(hora, minuto)

    fun horarioFlow() = configuracoes.horarioFlow
}
