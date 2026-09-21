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
            indiceBiblia = prefs[CHAVE_INDICE_BIBLIA] ?: 0,
            indiceMarcoAurelio = prefs[CHAVE_INDICE_MARCO] ?: 0,
            dataUltimaSelecao = dataSalva,
            ultimaPassagemFonte = fonteSalva,
            ultimaPassagemIndice = prefs[CHAVE_ULTIMO_INDICE_EXIBIDO] ?: 0,
        )
    }

    suspend fun salvarEstado(estado: EstadoSalvo) {
        context.dataStore.edit { prefs ->
            prefs[CHAVE_INDICE_BIBLIA] = estado.indiceBiblia
            prefs[CHAVE_INDICE_MARCO] = estado.indiceMarcoAurelio
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
        private val CHAVE_INDICE_BIBLIA = intPreferencesKey("indice_biblia")
        private val CHAVE_INDICE_MARCO = intPreferencesKey("indice_marco_aurelio")
        private val CHAVE_DATA_ULTIMA = stringPreferencesKey("data_ultima_selecao")
        private val CHAVE_ULTIMA_FONTE = stringPreferencesKey("ultima_passagem_fonte")
        private val CHAVE_ULTIMO_INDICE_EXIBIDO = intPreferencesKey("ultimo_indice_exibido")
    }
}
