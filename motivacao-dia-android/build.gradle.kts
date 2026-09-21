// As versões dos plugins do Android/Compose ficam declaradas direto em app/build.gradle.kts
// (em vez de apply false aqui) para que "./gradlew :core:test --configuration-on-demand"
// funcione sem precisar resolver o Android Gradle Plugin.
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.0.21" apply false
}
