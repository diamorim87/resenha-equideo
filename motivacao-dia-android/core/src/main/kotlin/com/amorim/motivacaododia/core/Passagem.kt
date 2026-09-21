package com.amorim.motivacaododia.core

enum class Fonte {
    BIBLIA,
    MARCO_AURELIO,
}

data class Passagem(
    val texto: String,
    val referencia: String,
    val fonte: Fonte,
)
