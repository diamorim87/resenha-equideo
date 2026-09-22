package com.amorim.motivacaododia.core

/** Escolhe um índice estável para o dia, ciclando pela lista sem precisar de estado salvo. */
object SelecaoDiaria {
    fun indiceParaHoje(diaDoAno: Int, tamanhoLista: Int): Int {
        require(tamanhoLista > 0) { "A lista precisa ter pelo menos um item." }
        return diaDoAno % tamanhoLista
    }
}
