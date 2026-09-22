package com.amorim.motivacaododia.core

import java.time.LocalDate

/**
 * Estado persistido (em DataStore, no app Android) que guia a seleção diária.
 *
 * [indices]: próximo índice a usar em cada fonte (ausente = 0).
 * [proximoEstoico]: posição em [SeletorDiario.ORDEM_ESTOICOS] do estoico do próximo dia ímpar.
 * [dataUltimaSelecao], [ultimaPassagemFonte], [ultimaPassagemIndice]: qual passagem já foi
 * exibida hoje, para reabrir o app no mesmo dia sem avançar a rotação de novo.
 */
data class EstadoSalvo(
    val indices: Map<Fonte, Int> = emptyMap(),
    val proximoEstoico: Int = 0,
    val dataUltimaSelecao: LocalDate? = null,
    val ultimaPassagemFonte: Fonte? = null,
    val ultimaPassagemIndice: Int = 0,
)

data class ResultadoDiario(
    val passagem: Passagem,
    val novoEstado: EstadoSalvo,
)

/**
 * Decide a passagem do dia e como o estado deve ser atualizado. Dias pares do ano são da
 * Bíblia; nos ímpares os estoicos se revezam em [ORDEM_ESTOICOS]. O estoico da vez vem de um
 * contador salvo (não do calendário), para a ordem se manter mesmo quando o app não roda
 * em algum dia ou quando dois dias ímpares ficam seguidos na virada do ano (365 → 1).
 *
 * Chamado tanto pelo alarme quanto pela tela ao abrir, de forma idempotente: reabrir no
 * mesmo dia não avança a rotação.
 */
class SeletorDiario(
    private val selector: PassagemSelector = PassagemSelector(),
) {
    fun passagemDeHoje(
        hoje: LocalDate,
        estado: EstadoSalvo,
        listas: Map<Fonte, List<Passagem>>,
    ): ResultadoDiario {
        val fonteJaExibida = estado.ultimaPassagemFonte
        if (estado.dataUltimaSelecao == hoje && fonteJaExibida != null) {
            val lista = listas.getValue(fonteJaExibida)
            return ResultadoDiario(lista[estado.ultimaPassagemIndice.mod(lista.size)], estado)
        }

        val diaDaBiblia = selector.ehDiaDaBiblia(hoje.dayOfYear)
        val fonte = if (diaDaBiblia) Fonte.BIBLIA else ORDEM_ESTOICOS[estado.proximoEstoico.mod(ORDEM_ESTOICOS.size)]
        val lista = listas.getValue(fonte)
        val indiceAtual = estado.indices[fonte] ?: 0
        val (passagem, proximoIndice) = selector.selecionar(lista, indiceAtual)

        val novoEstado = estado.copy(
            indices = estado.indices + (fonte to proximoIndice),
            proximoEstoico = if (diaDaBiblia) estado.proximoEstoico else (estado.proximoEstoico + 1).mod(ORDEM_ESTOICOS.size),
            dataUltimaSelecao = hoje,
            ultimaPassagemFonte = fonte,
            ultimaPassagemIndice = indiceAtual.mod(lista.size),
        )
        return ResultadoDiario(passagem, novoEstado)
    }

    companion object {
        val ORDEM_ESTOICOS = listOf(Fonte.MARCO_AURELIO, Fonte.SENECA, Fonte.EPICTETO)
    }
}
