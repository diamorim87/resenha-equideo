package com.amorim.motivacaododia.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.amorim.motivacaododia.core.EstadoSalvo
import com.amorim.motivacaododia.core.Fonte
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.time.LocalDate

private val Context.dataStore by preferencesDataStore(name = "motivacao_dia_prefs")

data class Horario(val hora: Int, val minuto: Int) {
    fun formatado(): String = "%02d:%02d".format(hora, minuto)
}

/**
 * Persiste o horário configurado do alarme e o estado de rotação das passagens
 * (índices e último dia/fonte exibidos) em DataStore Preferences, a única forma
 * de armazenamento usada — sem banco de dados nem bibliotecas de terceiros.
 */
class ConfiguracoesRepository(private val context: Context) {

    val horarioFlow: Flow<Horario> = context.dataStore.data.map { prefs ->
        Horario(
            hora = prefs[CHAVE_HORA] ?: HORA_PADRAO,
            minuto = prefs[CHAVE_MINUTO] ?: MINUTO_PADRAO,
        )
    }

    suspend fun horarioAtual(): Horario = horarioFlow.first()

    suspend fun salvarHorario(hora: Int, minuto: Int) {
        context.dataStore.edit { prefs ->
            prefs[CHAVE_HORA] = hora
            prefs[CHAVE_MINUTO] = minuto
        }
    }

    suspend fun lerEstado(): EstadoSalvo {
        val prefs = context.dataStore.data.first()
        val dataSalva = prefs[CHAVE_DATA_ULTIMA]?.takeIf { it.isNotBlank() }?.let(LocalDate::parse)
        val fonteSalva = prefs[CHAVE_ULTIMA_FONTE]?.takeIf { it.isNotBlank() }?.let(Fonte::valueOf)
        return EstadoSalvo(
            indices = CHAVES_INDICE.mapValues { (_, chave) -> prefs[chave] ?: 0 },
            proximoEstoico = prefs[CHAVE_PROXIMO_ESTOICO] ?: 0,
            dataUltimaSelecao = dataSalva,
            ultimaPassagemFonte = fonteSalva,
            ultimaPassagemIndice = prefs[CHAVE_ULTIMO_INDICE_EXIBIDO] ?: 0,
        )
    }

    suspend fun salvarEstado(estado: EstadoSalvo) {
        context.dataStore.edit { prefs ->
            CHAVES_INDICE.forEach { (fonte, chave) -> prefs[chave] = estado.indices[fonte] ?: 0 }
            prefs[CHAVE_PROXIMO_ESTOICO] = estado.proximoEstoico
            prefs[CHAVE_DATA_ULTIMA] = estado.dataUltimaSelecao?.toString() ?: ""
            prefs[CHAVE_ULTIMA_FONTE] = estado.ultimaPassagemFonte?.name ?: ""
            prefs[CHAVE_ULTIMO_INDICE_EXIBIDO] = estado.ultimaPassagemIndice
        }
    }

    companion object {
        const val HORA_PADRAO = 6
        const val MINUTO_PADRAO = 10

        private val CHAVE_HORA = intPreferencesKey("hora_alarme")
        private val CHAVE_MINUTO = intPreferencesKey("minuto_alarme")
        // Os nomes das chaves de Bíblia e Marco Aurélio são os da primeira versão, mantidos
        // para quem atualizar o app não perder a posição da rotação.
        private val CHAVES_INDICE = mapOf(
            Fonte.BIBLIA to intPreferencesKey("indice_biblia"),
            Fonte.MARCO_AURELIO to intPreferencesKey("indice_marco_aurelio"),
            Fonte.SENECA to intPreferencesKey("indice_seneca"),
            Fonte.EPICTETO to intPreferencesKey("indice_epicteto"),
        )
        private val CHAVE_PROXIMO_ESTOICO = intPreferencesKey("proximo_estoico")
        private val CHAVE_DATA_ULTIMA = stringPreferencesKey("data_ultima_selecao")
        private val CHAVE_ULTIMA_FONTE = stringPreferencesKey("ultima_passagem_fonte")
        private val CHAVE_ULTIMO_INDICE_EXIBIDO = intPreferencesKey("ultimo_indice_exibido")
    }
}
