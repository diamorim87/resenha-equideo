# Motivação do Dia

App Android nativo, 100% offline. Todo dia no horário configurado (padrão 06:10,
horário do próprio aparelho), mostra uma notificação com uma passagem curta,
alternando por dia entre a Bíblia (dias pares) e "Meditações" de Marco Aurélio
(dias ímpares). Sem servidor, sem login, sem internet.

## ⚠️ Limitação deste ambiente de build

Este projeto foi escrito num container Linux sem acesso a `dl.google.com`
(bloqueado por política de rede do ambiente). Isso significa que:

- O módulo `core` (lógica pura de seleção/rotação, sem depender do Android) foi
  **compilado e testado com sucesso** aqui — `./gradlew :core:test` passa com
  10 testes verdes (isso foi validado antes do Android Gradle Plugin ser
  adicionado ao classpath compartilhado do root; ver nota abaixo).
- O módulo `app` (o app Android em si) **não pôde ser compilado neste
  ambiente**, porque o Android Gradle Plugin e as platforms/build-tools do SDK
  só são baixados de `dl.google.com`. O código está completo, mas o `.apk`
  precisa ser gerado em uma máquina com o Android SDK instalado (ver abaixo).
  O `com.android.application` é declarado com `apply false` em
  `build.gradle.kts` (raiz) para compartilhar classloader com os plugins
  Kotlin — isso é necessário para o `:app` compilar, mas como efeito colateral
  também faz `./gradlew :core:test` precisar resolver o AGP mesmo rodando só
  o módulo `core`.

Revise o código-fonte antes de instalar no aparelho, como faria com qualquer
app; eu não pude rodar `assembleDebug` para confirmar que compila sem erros.

## Como gerar o APK (Windows, ou qualquer máquina com Android SDK)

```powershell
winget install EclipseAdoptium.Temurin.17.JDK
# Baixe "Command line tools only" em https://developer.android.com/studio#command-tools
# Extraia para: %LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat --licenses
%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat "platform-tools" "platforms;android-35" "build-tools;35.0.0"

cd motivacao-dia-android
.\gradlew.bat assembleDebug
```

O APK sai em `app/build/outputs/apk/debug/app-debug.apk`. Ou simplesmente abra
a pasta `motivacao-dia-android/` no Android Studio (Giraffe ou mais recente) e
rode direto — ele instala o SDK automaticamente.

## Como instalar no celular

**Opção 1 — fontes desconhecidas:** copie o `app-debug.apk` para o celular
(via cabo, Drive, etc.), abra o arquivo pelo gerenciador de arquivos e
autorize "instalar de fontes desconhecidas" quando o Android pedir.

**Opção 2 — `adb install`:** com o celular conectado via USB e depuração USB
ativada:
```
adb install app/build/outputs/apk/debug/app-debug.apk
```

Depois de instalar, abra o app uma vez para:
1. Conceder a permissão de notificações.
2. Tocar em "Ajustar" ao lado de "Alarmes exatos" (Android 12+) e autorizar.
3. Tocar em "Ajustar" ao lado de "Ignorar otimização de bateria" e autorizar.
4. Ler o aviso do fabricante detectado e, se aplicável, seguir as instruções
   do dontkillmyapp.com para esse aparelho (alguns fabricantes — Xiaomi,
   Samsung, Huawei etc. — matam apps em segundo plano de forma agressiva por
   padrão).

## Como editar as passagens

Edite `app/src/main/assets/passagens.json`. Cada item segue este formato:

```json
{ "texto": "Texto da passagem.", "referencia": "Referência", "fonte": "biblia" }
```

`fonte` só pode ser `"biblia"` ou `"marco_aurelio"`. É preciso manter pelo
menos 60 itens de cada fonte (hoje há 65 da Bíblia e 60 de Marco Aurélio).
Depois de editar, gere o APK de novo (`assembleDebug`).

**Sobre direitos autorais:** os versículos usam a tradução clássica de
Almeida (de domínio público); evite copiar de edições modernas registradas
como ARC, NVI ou NVT. Os trechos de Marco Aurélio são paráfrases originais
minhas, marcadas "(paráfrase)" — não são cópia de nenhuma tradução comercial
de "Meditações". Se for redistribuir o app além do uso pessoal, revise o
texto da Bíblia contra uma edição de domínio público confirmada antes de
publicar.

## Como mudar o horário

Direto no app: toque em "Alterar" no card "Horário do alarme" e escolha a
hora. Isso já reagenda o próximo alarme automaticamente. Não é necessário
mexer no código — o horário padrão (06:10, usado só na primeira abertura) fica
em `ConfiguracoesRepository.HORA_PADRAO` / `MINUTO_PADRAO`, em
`app/src/main/kotlin/com/amorim/motivacaododia/data/ConfiguracoesRepository.kt`.

## Como funciona o agendamento

- `AlarmManager.setAlarmClock()` — não `setRepeating()` nem `WorkManager`
  periódico — porque é o único mecanismo tratado pelo Android como alarme de
  despertador, sobrevivendo ao modo Doze e a apps mortos em segundo plano.
- Cada disparo do `AlarmReceiver` mostra a notificação e já agenda o alarme do
  dia seguinte.
- `BootReceiver` reagenda em `BOOT_COMPLETED`, `MY_PACKAGE_REPLACED`,
  `TIME_SET` e `TIMEZONE_CHANGED`.
- A tela principal também reagenda toda vez que é aberta (idempotente — só
  reafirma o mesmo próximo horário), como rede de segurança.

## Validação em aparelho real (não testável neste ambiente)

Depois de instalar num celular físico:

```
adb shell dumpsys alarm | grep com.amorim.motivacaododia
adb shell dumpsys deviceidle force-idle
```

O primeiro comando deve mostrar o próximo alarme agendado; o segundo simula o
modo Doze — a notificação deve chegar mesmo assim, porque `setAlarmClock()` é
exento das restrições de Doze.

## Testes automatizados

```
cd motivacao-dia-android
./gradlew :core:test
```

Cobrem: alternância Bíblia/Marco Aurélio por paridade do dia do ano, rotação
sequencial sem repetir item até esgotar cada lista, reinício do ciclo após
esgotar, e idempotência ao reabrir o app no mesmo dia.

## Não publicar na Play Store

Este projeto é para uso pessoal/offline — não gere um build de release nem
publique na Play Store.
