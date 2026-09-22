package com.amorim.motivacaododia.data

import android.content.Context
import com.amorim.motivacaododia.core.Fonte
import com.amorim.motivacaododia.core.Passagem
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * Lê app/src/main/assets/passagens.json uma única vez e mantém as listas em memória.
 * Usa org.json (parte do próprio Android) para não precisar de nenhuma biblioteca externa.
 */
class PassagemRepository(private val context: Context) {

    private var cache: List<Passagem>? = null

    fun todasAsPassagens(): List<Passagem> {
        cache?.let { return it }
        val texto = context.assets.open(ARQUIVO_ASSET).use { input ->
            BufferedReader(InputStreamReader(input, Charsets.UTF_8)).readText()
        }
        val array = JSONArray(texto)
        val lista = buildList {
            for (i in 0 until array.length()) {
                val item = array.getJSONObject(i)
                val fonte = when (item.getString("fonte")) {
                    "biblia" -> Fonte.BIBLIA
                    "marco_aurelio" -> Fonte.MARCO_AURELIO
                    "seneca" -> Fonte.SENECA
                    "epicteto" -> Fonte.EPICTETO
                    else -> continue
                }
                add(
                    Passagem(
                        texto = item.getString("texto"),
                        referencia = item.getString("referencia"),
                        fonte = fonte,
                    ),
                )
            }
        }
        cache = lista
        return lista
    }

    fun passagensPorFonte(): Map<Fonte, List<Passagem>> = todasAsPassagens().groupBy { it.fonte }

    companion object {
        private const val ARQUIVO_ASSET = "passagens.json"
    }
}
