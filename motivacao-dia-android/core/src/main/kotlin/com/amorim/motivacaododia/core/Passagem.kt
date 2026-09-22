package com.amorim.motivacaododia.core

enum class Fonte(val rotulo: String) {
    BIBLIA("Bíblia"),
    MARCO_AURELIO("Marco Aurélio"),
    SENECA("Sêneca"),
    EPICTETO("Epicteto"),
}

data class Passagem(
    val texto: String,
    val referencia: String,
    val fonte: Fonte,
)
