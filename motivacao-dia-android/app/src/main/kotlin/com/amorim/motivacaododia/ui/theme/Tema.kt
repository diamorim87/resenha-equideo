package com.amorim.motivacaododia.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.amorim.motivacaododia.core.Fonte

private val Ambar = Color(0xFFB5793A)
private val AzulSereno = Color(0xFF3C5A6E)
private val CremeClaro = Color(0xFFFBF6EC)
private val TintaNoite = Color(0xFF241C15)
private val AmbarSuave = Color(0xFFF1E2CC)

private val EsquemaClaro = lightColorScheme(
    primary = Ambar,
    onPrimary = Color.White,
    secondary = AzulSereno,
    onSecondary = Color.White,
    background = CremeClaro,
    onBackground = TintaNoite,
    surface = Color.White,
    onSurface = TintaNoite,
    surfaceVariant = AmbarSuave,
    onSurfaceVariant = TintaNoite,
    // Cards do M3 usam surfaceContainerHighest; sem isso herdam o lilás padrão do Material.
    surfaceContainerLowest = Color.White,
    surfaceContainerLow = Color(0xFFFDF9F2),
    surfaceContainer = Color(0xFFF9F2E6),
    surfaceContainerHigh = Color(0xFFF6EEE0),
    surfaceContainerHighest = Color(0xFFF3EADB),
    error = Color(0xFFB3392C),
)

private val EsquemaEscuro = darkColorScheme(
    primary = Color(0xFFD9A85C),
    onPrimary = Color(0xFF241C15),
    secondary = Color(0xFF9FBFD3),
    onSecondary = Color(0xFF17212B),
    background = Color(0xFF17130F),
    onBackground = Color(0xFFF3E9D8),
    surface = Color(0xFF241E17),
    onSurface = Color(0xFFF3E9D8),
    surfaceVariant = Color(0xFF352A1E),
    onSurfaceVariant = Color(0xFFF3E9D8),
    surfaceContainerLowest = Color(0xFF120F0B),
    surfaceContainerLow = Color(0xFF1E1914),
    surfaceContainer = Color(0xFF221C16),
    surfaceContainerHigh = Color(0xFF2A231B),
    surfaceContainerHighest = Color(0xFF30281F),
    error = Color(0xFFE1897B),
)

private val Formas = Shapes(
    small = RoundedCornerShape(14.dp),
    medium = RoundedCornerShape(20.dp),
    large = RoundedCornerShape(28.dp),
)

private val Tipografia = Typography().let { base ->
    base.copy(
        headlineSmall = base.headlineSmall.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold),
        titleLarge = base.titleLarge.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.SemiBold),
        titleMedium = base.titleMedium.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.SemiBold),
        bodyLarge = base.bodyLarge.copy(fontFamily = FontFamily.Serif, lineHeight = 26.sp),
    )
}

@Composable
fun MotivacaoDoDiaTheme(content: @Composable () -> Unit) {
    val esquema = if (isSystemInDarkTheme()) EsquemaEscuro else EsquemaClaro
    MaterialTheme(colorScheme = esquema, typography = Tipografia, shapes = Formas, content = content)
}

@Composable
fun corAcentoFonte(fonte: Fonte) =
    if (fonte == Fonte.BIBLIA) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.primary
