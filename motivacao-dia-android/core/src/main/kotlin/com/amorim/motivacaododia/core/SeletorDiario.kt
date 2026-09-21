package com.amorim.motivacaododia.core

import java.time.LocalDate

/**
 * Estado persistido (em DataStore, no app Android) que guia a seleção diária.
 *
 * [indiceBiblia] / [indiceMarcoAurelio]: próximo índice a usar em cada fonte.
 * [dataUltimaSelecao], [ultimaPassagemFonte], [ultimaPassagemIndice]: qual passagem já foi
 * exibida hoje, para reabrir o app no mesmo dia sem avançar a rotação de novo.
 */
data class EstadoSalvo(
    val indiceBiblia: Int = 0,
    val indiceMarcoAurelio: Int = 0,
    val dataUltimaSelecao: LocalDate? = null,
    val ultimaPassagemFonte: Fonte? = null,
    val ultimaPassagemIndice: Int = 0,
)

data class ResultadoDiario(
    val passagem: Passagem,
    val novoEstado: EstadoSalvo,
)

/**
 * Decide a passagem do dia e como o estado deve ser atualizado.
 * Chamado tanto pelo alarme (06:10, ou o horário configurado) quanto pela tela ao abrir,
 * de forma idempotente: reabrir no mesmo dia não avança a rotação.
 */
class SeletorDiario(
    private val selector: PassagemSelector = PassagemSelector(),
) {
    fun passagemDeHoje(
        hoje: LocalDate,
        estado: EstadoSalvo,
        listaBiblia: List<Passagem>,
        listaMarcoAurelio: List<Passagem>,
    ): ResultadoDiario {
        val fonte = selector.fonteDoDia(hoje.dayOfYear)
        val lista = listaPara(fonte, listaBiblia, listaMarcoAurelio)

        if (estado.dataUltimaSelecao == hoje && estado.ultimaPassagemFonte == fonte) {
            val indiceExibido = estado.ultimaPassagemIndice.mod(lista.size)
            return ResultadoDiario(lista[indiceExibido], estado)
        }

        val indiceAtual = if (fonte == Fonte.BIBLIA) estado.indiceBiblia else estado.indiceMarcoAurelio
        val (passagem, proximoIndice) = selector.selecionar(lista, indiceAtual)
        val indiceExibido = indiceAtual.mod(lista.size)

        val novoEstado = estado.copy(
            indiceBiblia = if (fonte == Fonte.BIBLIA) proximoIndice else estado.indiceBiblia,
            indiceMarcoAurelio = if (fonte == Fonte.MARCO_AURELIO) proximoIndice else estado.indiceMarcoAurelio,
            dataUltimaSelecao = hoje,
            ultimaPassagemFonte = fonte,
            ultimaPassagemIndice = indiceExibido,
        )
        return ResultadoDiario(passagem, novoEstado)
    }

    private fun listaPara(
        fonte: Fonte,
        listaBiblia: List<Passagem>,
        listaMarcoAurelio: List<Passagem>,
    ): List<Passagem> = if (fonte == Fonte.BIBLIA) listaBiblia else listaMarcoAurelio
}
