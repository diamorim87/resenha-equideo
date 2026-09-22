package com.amorim.motivacaododia.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class PassagemSelectorTest {

    private val selector = PassagemSelector()

    @Test
    fun `dia par do ano e dia da Biblia`() {
        listOf(2, 4, 60, 300, 366).forEach { dia ->
            assertTrue(selector.ehDiaDaBiblia(dia), "dia $dia deveria ser Bíblia")
        }
    }

    @Test
    fun `dia impar do ano nao e dia da Biblia`() {
        listOf(1, 3, 59, 301, 365).forEach { dia ->
            assertFalse(selector.ehDiaDaBiblia(dia), "dia $dia deveria ser de um estoico")
        }
    }

    @Test
    fun `rotacao percorre todos os indices sem repetir antes de esgotar a lista`() {
        val passagens = (0 until 5).map { Passagem("texto $it", "ref $it", Fonte.BIBLIA) }

        var indice = 0
        val vistos = mutableListOf<Int>()
        repeat(passagens.size) {
            val resultado = selector.selecionar(passagens, indice)
            vistos += passagens.indexOf(resultado.passagem)
            indice = resultado.proximoIndiceSalvo
        }

        assertEquals((0 until passagens.size).toList(), vistos, "deve mostrar cada item exatamente uma vez, em ordem")
        assertEquals(vistos.toSet().size, passagens.size, "não pode haver repetição dentro de uma volta completa")
    }

    @Test
    fun `apos esgotar a lista o ciclo recomeca do inicio`() {
        val passagens = (0 until 3).map { Passagem("texto $it", "ref $it", Fonte.MARCO_AURELIO) }

        var indice = 0
        val ciclo1 = mutableListOf<Int>()
        repeat(passagens.size) {
            val r = selector.selecionar(passagens, indice)
            ciclo1 += passagens.indexOf(r.passagem)
            indice = r.proximoIndiceSalvo
        }

        val ciclo2 = mutableListOf<Int>()
        repeat(passagens.size) {
            val r = selector.selecionar(passagens, indice)
            ciclo2 += passagens.indexOf(r.passagem)
            indice = r.proximoIndiceSalvo
        }

        assertEquals(ciclo1, ciclo2, "o segundo ciclo deve repetir a mesma ordem do primeiro")
    }

    @Test
    fun `lista com um unico item sempre retorna o mesmo item sem travar`() {
        val passagens = listOf(Passagem("único", "ref", Fonte.BIBLIA))
        var indice = 0
        repeat(10) {
            val r = selector.selecionar(passagens, indice)
            assertEquals(passagens[0], r.passagem)
            indice = r.proximoIndiceSalvo
        }
    }

    @Test
    fun `lista vazia lanca excecao em vez de retornar estado invalido`() {
        assertFailsWith<IllegalArgumentException> {
            selector.selecionar(emptyList(), 0)
        }
    }

    @Test
    fun `indice salvo negativo ou fora da faixa nao quebra a selecao`() {
        val passagens = (0 until 4).map { Passagem("texto $it", "ref $it", Fonte.BIBLIA) }
        val resultado = selector.selecionar(passagens, -1)
        assertTrue(resultado.passagem in passagens)
    }
}
