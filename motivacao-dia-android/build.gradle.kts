// Todo plugin usado pelo módulo :app precisa ser pré-resolvido aqui (apply false) para
// cair no classloader compartilhado do build. Se um plugin for declarado só dentro de
// app/build.gradle.kts com sua própria versão, ele carrega num classloader FILHO isolado —
// e um plugin já resolvido no classloader pai (como kotlin.android, vindo daqui) não
// consegue enxergar as classes desse filho. Foi exatamente isso que causou
// "Could not generate a decorated class for type KotlinAndroidTarget >
// com/android/build/gradle/api/BaseVariant": kotlin.android via root, com.android.application
// só via app, cada um em um classloader diferente.
//
// Consequência: "./gradlew :core:test" deixa de funcionar sem resolver o Android Gradle
// Plugin (dl.google.com), mas isso é necessário para o :app compilar corretamente.
plugins {
    id("org.jetbrains.kotlin.jvm") version "2.1.0" apply false
    id("org.jetbrains.kotlin.android") version "2.1.0" apply false
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.0" apply false
    id("com.android.application") version "8.7.2" apply false
}
