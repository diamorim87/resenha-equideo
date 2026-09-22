package com.amorim.motivacaododia.core

import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals

class SeletorDiarioTest {

    private val seletor = SeletorDiario()

    private fun listas(tamanho: Int): Map<Fonte, List<Passagem>> =
        Fonte.entries.associateWith { fonte ->
            (0 until tamanho).map { Passagem("${fonte.name} $it", "ref-${fonte.name}-$it", fonte) }
        }

    private fun simular(dias: Int, inicio: LocalDate, tamanho: Int): List<Passagem> {
        val listas = listas(tamanho)
        var estado = EstadoSalvo()
        var dia = inicio
        return List(dias) {
            val resultado = seletor.passagemDeHoje(dia, estado, listas)
            estado = resultado.novoEstado
            dia = dia.plusDays(1)
            resultado.passagem
        }
    }

    @Test
    fun `reabrir no mesmo dia retorna a mesma passagem sem avancar a rotacao`() {
        val listas = listas(5)
        listOf(LocalDate.of(2026, 1, 2), LocalDate.of(2026, 1, 3)).forEach { hoje -> // par e ímpar
            val primeira = seletor.passagemDeHoje(hoje, EstadoSalvo(), listas)
            val segunda = seletor.passagemDeHoje(hoje, primeira.novoEstado, listas)

            assertEquals(primeira.passagem, segunda.passagem)
            assertEquals(primeira.novoEstado, segunda.novoEstado)
        }
    }

    @Test
    fun `dias pares sao da Biblia e impares de um estoico`() {
        var dia = LocalDate.of(2026, 3, 1)
        simular(dias = 20, inicio = dia, tamanho = 10).forEach { passagem ->
            if (dia.dayOfYear % 2 == 0) {
                assertEquals(Fonte.BIBLIA, passagem.fonte, "dia ${dia.dayOfYear} deveria ser Bíblia")
            } else {
                assertEquals(true, passagem.fonte in SeletorDiario.ORDEM_ESTOICOS, "dia ${dia.dayOfYear} deveria ser estoico")
            }
            dia = dia.plusDays(1)
        }
    }

    @Test
    fun `estoicos se revezam em ordem Marco, Seneca, Epicteto`() {
        val estoicos = simular(dias = 30, inicio = LocalDate.of(2026, 3, 1), tamanho = 10)
            .map { it.fonte }
            .filter { it != Fonte.BIBLIA }

        val esperado = List(estoicos.size) { SeletorDiario.ORDEM_ESTOICOS[it % 3] }
        assertEquals(esperado, estoicos)
    }

    @Test
    fun `revezamento dos estoicos continua na virada do ano, com dois dias impares seguidos`() {
        // 30/12/2026 é o dia 364 (par), 31/12 é o 365 (ímpar) e 01/01/2027 é o 1 (ímpar).
        val estoicos = simular(dias = 6, inicio = LocalDate.of(2026, 12, 30), tamanho = 10)
            .map { it.fonte }
            .filter { it != Fonte.BIBLIA }

        val esperado = List(estoicos.size) { SeletorDiario.ORDEM_ESTOICOS[it % 3] }
        assertEquals(esperado, estoicos)
    }

    @Test
    fun `nao repete passagem de nenhuma fonte antes de esgotar a lista`() {
        val tamanho = 4
        val porFonte = simular(dias = 120, inicio = LocalDate.of(2026, 1, 1), tamanho = tamanho)
            .groupBy { it.fonte }

        assertEquals(Fonte.entries.toSet(), porFonte.keys, "todas as fontes deveriam aparecer")
        porFonte.forEach { (fonte, passagens) ->
            passagens.chunked(tamanho).filter { it.size == tamanho }.forEach { bloco ->
                assertEquals(tamanho, bloco.toSet().size, "$fonte repetiu item antes de esgotar a lista: $bloco")
            }
        }
    }
}
