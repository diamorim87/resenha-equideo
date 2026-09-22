// kotlin.jvm, kotlin.android e kotlin.plugin.compose vêm do mesmo artefato do Kotlin
// Gradle Plugin: por isso a versão precisa ser declarada uma única vez aqui (apply false)
// e reaplicada sem versão em app/build.gradle.kts — declarar a versão nos dois lugares
// causa "plugin already on the classpath with an unknown version".
//
// com.android.application é um artefato separado (AGP), então continua declarado só em
// app/build.gradle.kts; isso preserva "./gradlew :core:test --configure-on-demand" rodando
// sem precisar resolver o Android Gradle Plugin.
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.1.0" apply false
    id("org.jetbrains.kotlin.android") version "2.1.0" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.0" apply false
}
