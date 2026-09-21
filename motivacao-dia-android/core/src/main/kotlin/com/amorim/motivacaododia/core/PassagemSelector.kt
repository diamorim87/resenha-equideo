package com.amorim.motivacaododia.core

/**
 * Regras puras de seleção: qual fonte usar em cada dia do ano, e como
 * rotacionar dentro de uma lista sem repetir nenhum item até esgotá-la.
 * Não depende de Android para poder ser testada em JVM puro.
 */
class PassagemSelector {

    fun fonteDoDia(diaDoAno: Int): Fonte =
        if (diaDoAno % 2 == 0) Fonte.BIBLIA else Fonte.MARCO_AURELIO

    /**
     * [indiceSalvo] é o próximo índice a usar nesta fonte (persistido entre execuções).
     * Retorna a passagem escolhida e o índice que deve ser salvo para a próxima chamada,
     * avançando sequencialmente e voltando a 0 só depois de passar por todos os itens.
     */
    fun selecionar(passagens: List<Passagem>, indiceSalvo: Int): ResultadoSelecao {
        require(passagens.isNotEmpty()) { "Lista de passagens não pode ser vazia" }
        val indice = indiceSalvo.mod(passagens.size)
        val proximoIndice = (indice + 1).mod(passagens.size)
        return ResultadoSelecao(passagens[indice], proximoIndice)
    }
}

data class ResultadoSelecao(
    val passagem: Passagem,
    val proximoIndiceSalvo: Int,
)
