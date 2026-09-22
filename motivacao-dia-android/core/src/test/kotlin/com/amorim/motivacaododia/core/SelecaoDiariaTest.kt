package com.amorim.motivacaododia.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class SelecaoDiariaTest {

    @Test
    fun `retorna indices dentro do tamanho da lista, ciclando ao passar do fim`() {
        assertEquals(0, SelecaoDiaria.indiceParaHoje(diaDoAno = 30, tamanhoLista = 30))
        assertEquals(1, SelecaoDiaria.indiceParaHoje(diaDoAno = 31, tamanhoLista = 30))
        assertEquals(29, SelecaoDiaria.indiceParaHoje(diaDoAno = 29, tamanhoLista = 30))
    }

    @Test
    fun `rejeita lista vazia`() {
        assertFailsWith<IllegalArgumentException> {
            SelecaoDiaria.indiceParaHoje(diaDoAno = 10, tamanhoLista = 0)
        }
    }
}
