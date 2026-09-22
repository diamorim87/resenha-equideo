# Motivação do Dia

App Android nativo, 100% offline. Todo dia no horário configurado (padrão 06:10,
horário do próprio aparelho), toca um alarme de verdade — som com volume
crescente + vibração, em tela cheia mesmo com o aparelho bloqueado — com uma
passagem curta:

- **dias pares do ano:** Bíblia;
- **dias ímpares:** um filósofo estoico, revezando Marco Aurélio → Sêneca →
  Epicteto.

Também tem um card fixo "Antes de dormir" com uma reflexão diferente a cada dia.
Sem servidor, sem login, sem internet.

## Como gerar o APK (Windows)

Pré-requisitos (uma vez só):

1. **JDK 17** — instalador `.msi` do Eclipse Temurin 17 em
   <https://adoptium.net/temurin/releases/?version=17&os=windows&arch=x64>.
   Na tela "Custom Setup", ative **"Set or override JAVA_HOME variable"**.
   O Java que vem com o Android Studio (JBR 25) **não** serve: o Gradle 8.14.3
   deste projeto só roda com Java até a versão 24.
2. **Android SDK** — abrir o Android Studio uma vez já instala em
   `%LOCALAPPDATA%\Android\Sdk`.

Depois, num PowerShell novo:

```powershell
java -version    # precisa mostrar 17.x
git clone https://github.com/diamorim87/motivacao-do-dia.git
cd motivacao-do-dia
$sdk = ($env:LOCALAPPDATA -replace '\\','/') + '/Android/Sdk'
"sdk.dir=$sdk" | Out-File -FilePath local.properties -Encoding ascii
.\gradlew.bat assembleDebug
```

O APK sai em `app\build\outputs\apk\debug\app-debug.apk`. Para as próximas
versões basta `git pull` e `.\gradlew.bat assembleDebug` de novo
(`local.properties` fica só na sua máquina, fora do git).

## Como instalar no celular

Copie o `app-debug.apk` para o celular (Google Drive funciona; WhatsApp
bloqueia arquivos `.apk`), abra pelo gerenciador de arquivos e autorize
"instalar de fontes desconhecidas". Versões novas podem ser instaladas por
cima, sem desinstalar — as configurações e a posição da rotação são mantidas.

Depois de instalar, abra o app uma vez e deixe as quatro permissões como
"Concedida": notificações, alarmes exatos, ignorar otimização de bateria e
alarme em tela cheia (Android 14+; sem ela o alarme toca, mas com o aparelho
bloqueado o Android só mostra uma notificação em vez de abrir a tela do
alarme). Leia também o aviso do fabricante e siga o dontkillmyapp.com do seu
aparelho.

## Como editar as passagens

Edite `app/src/main/assets/passagens.json`. Cada item segue este formato:

```json
{ "texto": "Texto da passagem.", "referencia": "Referência", "fonte": "biblia" }
```

`fonte` pode ser `"biblia"`, `"marco_aurelio"`, `"seneca"` ou `"epicteto"`.
Hoje há 100 da Bíblia e 60 de cada estoico. Cada fonte percorre todos os
seus itens, em ordem, antes de repetir. Depois de editar, gere o APK de novo.

**Sobre direitos autorais:** os versículos seguem a tradução clássica de
Almeida (domínio público); evite copiar de edições modernas registradas
(ARC revisadas, NVI, NVT). Os trechos dos estoicos são **paráfrases
originais**, marcadas "(paráfrase)" — as obras antigas são de domínio
público, mas as traduções modernas para o português não são. As referências
de Sêneca e Epicteto apontam para a carta/capítulo real de onde vem a ideia;
nas de Marco Aurélio, os números de seção dentro de cada livro são
aproximados. Se for redistribuir o app além do uso pessoal, revise os textos
contra edições de domínio público confirmadas.

## Como mudar o horário

Direto no app: toque em "Alterar" no card "Horário do alarme". Isso já
reagenda o próximo alarme. O padrão da primeira abertura (06:10) fica em
`ConfiguracoesRepository.HORA_PADRAO` / `MINUTO_PADRAO`.

## Como funciona o agendamento e o alarme

- `AlarmManager.setAlarmClock()` — não `setRepeating()` nem `WorkManager` —
  porque é o único mecanismo tratado pelo Android como despertador,
  sobrevivendo ao modo Doze.
- Cada disparo do `AlarmReceiver` inicia o `AlarmRingService` (foreground
  service) e já agenda o alarme do dia seguinte. O serviço toca o som de
  alarme padrão do aparelho em loop, começando em 10% e subindo até 100% em
  30 segundos, e vibra. A notificação dele tem `fullScreenIntent` para a
  `AlarmActivity`.
- Com o aparelho bloqueado ou a tela apagada, o Android abre a `AlarmActivity`
  por cima da tela de bloqueio. Com a tela acesa e desbloqueada, mostra só uma
  notificação heads-up (comportamento do próprio Android) — toque nela para
  abrir a tela do alarme.
- "Dispensar" para som e vibração e encerra o serviço.
- `BootReceiver` reagenda em `BOOT_COMPLETED`, `MY_PACKAGE_REPLACED`,
  `TIME_SET` e `TIMEZONE_CHANGED`; a tela principal também reagenda ao abrir.
- O estoico da vez vem de um contador salvo no aparelho, não do calendário,
  para a ordem Marco → Sêneca → Epicteto se manter mesmo em dias em que o app
  não rodou e na virada do ano (31/12 e 01/01 são ambos dias ímpares).

## Validação em aparelho real

Com o celular conectado via USB e depuração ativada:

```
adb shell dumpsys alarm | grep com.amorim.motivacaododia
adb shell dumpsys deviceidle force-idle
```

O primeiro mostra o próximo alarme agendado; o segundo simula o modo Doze — o
alarme deve tocar mesmo assim.

## Testes automatizados

```
.\gradlew.bat :core:test
```

Cobrem: Bíblia nos dias pares e estoicos nos ímpares, revezamento
Marco → Sêneca → Epicteto (inclusive na virada do ano), rotação sem repetir
item de nenhuma fonte até esgotá-la, idempotência ao reabrir no mesmo dia e a
escolha da mensagem de "Antes de dormir". Tocar som, vibrar e abrir tela sobre
o bloqueio só dá para validar em aparelho real.

## Não publicar na Play Store

Projeto para uso pessoal/offline — não gere build de release nem publique na
Play Store.
