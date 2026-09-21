package com.amorim.motivacaododia.core

import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class SeletorDiarioTest {

    private val seletor = SeletorDiario()

    private fun listaBiblia(n: Int) = (0 until n).map { Passagem("biblia $it", "ref-b$it", Fonte.BIBLIA) }
    private fun listaMarco(n: Int) = (0 until n).map { Passagem("marco $it", "ref-m$it", Fonte.MARCO_AURELIO) }

    @Test
    fun `reabrir no mesmo dia retorna a mesma passagem sem avancar a rotacao`() {
        val hoje = LocalDate.of(2026, 1, 2) // dia par -> Bíblia
        val biblia = listaBiblia(5)
        val marco = listaMarco(5)

        val primeira = seletor.passagemDeHoje(hoje, EstadoSalvo(), biblia, marco)
        val segunda = seletor.passagemDeHoje(hoje, primeira.novoEstado, biblia, marco)

        assertEquals(primeira.passagem, segunda.passagem)
        assertEquals(primeira.novoEstado, segunda.novoEstado)
    }

    @Test
    fun `dias consecutivos alternam entre Biblia e Marco Aurelio`() {
        val biblia = listaBiblia(10)
        val marco = listaMarco(10)
        var estado = EstadoSalvo()
        var dia = LocalDate.of(2026, 3, 1)

        val fontesObservadas = mutableListOf<Fonte>()
        repeat(8) {
            val resultado = seletor.passagemDeHoje(dia, estado, biblia, marco)
            fontesObservadas += resultado.passagem.fonte
            estado = resultado.novoEstado
            dia = dia.plusDays(1)
        }

        for (i in 1 until fontesObservadas.size) {
            assertNotEquals(fontesObservadas[i - 1], fontesObservadas[i], "fontes não deveriam repetir em dias seguidos")
        }
    }

    @Test
    fun `nao repete passagem da mesma fonte antes de esgotar a lista, em muitos dias seguidos`() {
        val tamanho = 4
        val biblia = listaBiblia(tamanho)
        val marco = listaMarco(tamanho)
        var estado = EstadoSalvo()
        var dia = LocalDate.of(2026, 1, 1)

        val textosBiblia = mutableListOf<String>()
        val textosMarco = mutableListOf<String>()

        repeat(40) {
            val resultado = seletor.passagemDeHoje(dia, estado, biblia, marco)
            when (resultado.passagem.fonte) {
                Fonte.BIBLIA -> textosBiblia += resultado.passagem.texto
                Fonte.MARCO_AURELIO -> textosMarco += resultado.passagem.texto
            }
            estado = resultado.novoEstado
            dia = dia.plusDays(1)
        }

        // Cada bloco de `tamanho` usos consecutivos da mesma fonte deve ser uma volta completa sem repetição.
        textosBiblia.chunked(tamanho).filter { it.size == tamanho }.forEach { bloco ->
            assertEquals(tamanho, bloco.toSet().size, "bloco de Bíblia repetiu item antes de esgotar a lista: $bloco")
        }
        textosMarco.chunked(tamanho).filter { it.size == tamanho }.forEach { bloco ->
            assertEquals(tamanho, bloco.toSet().size, "bloco de Marco Aurélio repetiu item antes de esgotar a lista: $bloco")
        }
    }
}
