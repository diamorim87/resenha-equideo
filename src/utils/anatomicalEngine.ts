import { CanvasId, ToolType } from '../types';

export const DICIONARIO_CORES: Record<string, string> = {
  black: 'marcação/despigmentação escura',
  red: 'cicatriz / ferida / marca a fogo',
  saddlebrown: 'mancha castanha / alazã',
  white: 'mancha branca / calçado / luzeiro',
};

/**
 * Mapeamento Anatômico Zootécnico Oficial de Equídeos
 */
export function mapearZonaZootecnica(
  idCanvas: CanvasId,
  x: number,
  y: number,
  largura: number,
  altura: number
): string {
  const percentualY = y / altura;
  const percentualX = x / largura;

  // Vistas da Cabeça (Frontal e Chanfro)
  if (idCanvas === 'canvasFrontal' || idCanvas === 'canvasChanfro') {
    if (percentualY < 0.15) return 'Nuca / Entre as Orelhas';
    if (percentualY < 0.35) return 'Fronte (Testa)';
    if (percentualY < 0.70) return 'Chanfro';
    if (percentualY < 0.85) return 'Focinho / Narinas';
    if (percentualY < 0.95) return 'Lábio Superior / Inferior';
    return 'Queixo / Mento / Barbelo';
  }

  // Vistas do Corpo (Lateral Esquerda e Direita)
  if (percentualY > 0.62) {
    // Região dos Membros e Ventre
    if (percentualX < 0.38) {
      if (percentualY > 0.90) return 'Casco / Coroa do Membro Torácico (Anterior)';
      if (percentualY > 0.80) return 'Boleto / Quartela do Membro Torácico';
      if (percentualY > 0.70) return 'Canela do Membro Torácico';
      return 'Joelho / Antebraço do Membro Torácico';
    }
    if (percentualX > 0.62) {
      if (percentualY > 0.90) return 'Casco / Coroa do Membro Pélvico (Posterior)';
      if (percentualY > 0.80) return 'Boleto / Quartela do Membro Pélvico';
      if (percentualY > 0.70) return 'Canela do Membro Pélvico';
      return 'Jarrete / Perna do Membro Pélvico';
    }
    return 'Ventre / Flanco Inferior';
  } else {
    // Região Superior do Corpo
    if (percentualX < 0.35) {
      if (percentualY < 0.22) return 'Nuca / Garganta / Fronte Lateral';
      if (percentualY < 0.45) return 'Tábua do Pescoço';
      return 'Espádua / Ombro / Braço';
    }
    if (percentualX >= 0.35 && percentualX <= 0.62) {
      if (percentualY < 0.32) return 'Cernelha / Dorso';
      return 'Costado / Costelas / Flanco';
    }
    if (percentualX > 0.62) {
      if (percentualY < 0.35) return 'Lombo / Garupa';
      if (percentualY < 0.55) return 'Anca / Nádega / Coxa';
      return 'Perna / Jarrete Superior';
    }
    return 'Tronco';
  }
}

export function gerarTextoMarca(
  idCanvas: CanvasId,
  x: number,
  y: number,
  largura: number,
  altura: number,
  ferramenta: ToolType,
  cor: string,
  espessura: number
): string | null {
  if (ferramenta === 'borracha') return null;

  const zona = mapearZonaZootecnica(idCanvas, x, y, largura, altura);
  const significadoCor = DICIONARIO_CORES[cor] || 'marcação';
  let texto = '';

  if (ferramenta === 'carimbo_x') {
    texto = `Rodopio de pelos identificado na região do(a) ${zona}`;
  } else if (ferramenta === 'carimbo_edir') {
    texto = `Espiga (virada à direita) localizada no(a) ${zona}`;
  } else if (ferramenta === 'carimbo_eesq') {
    texto = `Espiga (virada à esquerda) localizada no(a) ${zona}`;
  } else if (ferramenta === 'lapis') {
    if (cor === 'white') {
      if (espessura > 7) {
        texto = `Amplo calçado / mancha branca despigmentada abrangendo o(a) ${zona}`;
      } else {
        texto = `Pequeno sinal / mancha branca no(a) ${zona}`;
      }
    } else if (espessura > 8) {
      texto = `Ampla ${significadoCor} abrangendo a região do(a) ${zona}`;
    } else {
      texto = `Pequena ${significadoCor} anotada no(a) ${zona}`;
    }
  }

  if (idCanvas === 'canvasLatEsq') texto += ' (Vista Lateral Esquerda)';
  if (idCanvas === 'canvasLatDir') texto += ' (Vista Lateral Direita)';
  if (idCanvas === 'canvasFrontal') texto += ' (Vista Frontal)';
  if (idCanvas === 'canvasChanfro') texto += ' (Vista Chanfro/Focinho)';

  return texto + '.';
}

export function compilarResenhaDescritiva(marcas: string[]): string {
  if (!marcas || marcas.length === 0) {
    return 'Sem particularidades ou marcações gráficas assinaladas pelo técnico resenhador na inspeção do animal.\n\nObservações gerais: Animal em conformidade com o padrão zootécnico declarado.';
  }

  let texto = 'RESENHA DESCRITIVA ZOOTÉCNICA:\n\n';
  texto += 'Baseado nas marcações gráficas e inspeção zootécnica, o animal apresenta as seguintes particularidades anatômicas:\n\n';
  
  marcas.forEach((marca) => {
    texto += `• ${marca}\n`;
  });

  texto += '\nObservações adicionais do técnico / Resenhador:\n';
  texto += 'Animal inspecionado em condições normais de manejo. Resenha conferida e validada.';

  return texto;
}
