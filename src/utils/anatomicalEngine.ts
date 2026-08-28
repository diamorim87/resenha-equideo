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

  // Vista de Peito, Pescoço e Queixo (visão frontal abaixo da cabeça)
  if (idCanvas === 'canvasPeito') {
    if (percentualY < 0.12) return 'Queixo / Ganachas';
    if (percentualY < 0.22) return 'Garganta (Leque/Gargantilhado)';
    if (percentualY < 0.60) return 'Tábua do Pescoço (Espada Romana)';
    if (percentualY < 0.78) return 'Base do Pescoço / Antepeito';
    return 'Peito / Maçã do Peito';
  }

  // Vistas do Corpo (Lateral Esquerda e Direita) — as duas ilustrações são
  // espelhadas entre si (cabeça à esquerda numa, à direita na outra), então
  // normalizamos para um eixo "efetivo" em que valores baixos sempre ficam do
  // lado da cabeça/peito e valores altos do lado da garupa/cauda, em qualquer
  // uma das duas vistas
  const xEfetivo = idCanvas === 'canvasLatDir' ? 1 - percentualX : percentualX;

  // Limiares calibrados por análise de pixels da ilustração: o corpo (tronco)
  // mantém-se largo até ~78% da altura; abaixo disso já são só os membros
  if (percentualY > 0.78) {
    // Região dos Membros
    if (xEfetivo < 0.38) {
      if (percentualY > 0.93) return 'Casco / Coroa do Membro Torácico (Anterior)';
      if (percentualY > 0.88) return 'Boleto / Quartela do Membro Torácico';
      if (percentualY > 0.83) return 'Canela do Membro Torácico';
      return 'Joelho / Antebraço do Membro Torácico';
    }
    if (xEfetivo > 0.62) {
      if (percentualY > 0.93) return 'Casco / Coroa do Membro Pélvico (Posterior)';
      if (percentualY > 0.88) return 'Boleto / Quartela do Membro Pélvico';
      if (percentualY > 0.83) return 'Canela do Membro Pélvico';
      return 'Jarrete / Perna do Membro Pélvico';
    }
    return 'Ventre / Flanco Inferior';
  } else {
    // Região Superior do Corpo
    if (xEfetivo < 0.35) {
      if (percentualY < 0.22) return 'Nuca / Garganta / Fronte Lateral';
      if (percentualY < 0.45) return 'Tábua do Pescoço';
      return 'Espádua / Ombro / Braço';
    }
    if (xEfetivo >= 0.35 && xEfetivo <= 0.62) {
      if (percentualY < 0.32) return 'Cernelha / Dorso';
      return 'Costado / Costelas / Flanco';
    }
    if (xEfetivo > 0.62) {
      if (percentualY < 0.35) return 'Lombo / Garupa';
      if (percentualY < 0.55) return 'Anca / Nádega / Coxa';
      return 'Perna / Jarrete Superior';
    }
    return 'Tronco';
  }
}

/** Converte o ângulo de rotação do carimbo de espiga (0°=direita, sentido horário) numa descrição em português */
export function descreverDirecaoEspiga(anguloGraus: number): string {
  const normalizado = ((anguloGraus % 360) + 360) % 360;
  const indice = Math.round(normalizado / 45) % 8;
  const direcoes = [
    'para a direita',
    'na diagonal inferior direita',
    'para baixo',
    'na diagonal inferior esquerda',
    'para a esquerda',
    'na diagonal superior esquerda',
    'para cima',
    'na diagonal superior direita',
  ];
  return direcoes[indice];
}

export function gerarTextoMarca(
  idCanvas: CanvasId,
  x: number,
  y: number,
  largura: number,
  altura: number,
  ferramenta: ToolType,
  cor: string,
  espessura: number,
  anguloEspiga: number = 0
): string | null {
  if (ferramenta === 'borracha') return null;

  const zona = mapearZonaZootecnica(idCanvas, x, y, largura, altura);
  const significadoCor = DICIONARIO_CORES[cor] || 'marcação';
  let texto = '';

  if (ferramenta === 'carimbo_x') {
    texto = `Rodopio de pelos identificado na região do(a) ${zona}`;
  } else if (ferramenta === 'carimbo_espiga') {
    texto = `Espiga (virada ${descreverDirecaoEspiga(anguloEspiga)}) localizada no(a) ${zona}`;
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
  if (idCanvas === 'canvasPeito') texto += ' (Vista Peito/Pescoço)';

  return texto + '.';
}

type CategoriaMarca = 'cabeca' | 'membroTE' | 'membroTD' | 'membroPE' | 'membroPD' | 'corpo';

/**
 * Classifica uma marca (já formatada por gerarTextoMarca, com o sufixo
 * "(Vista X)") na categoria zootécnica correspondente, seguindo a ordem de
 * descrição exigida pelo Manual de Confecção de Resenhas: cabeça, membros
 * (torácico esquerdo, torácico direito, pélvico esquerdo, pélvico direito)
 * e restante do corpo.
 */
function categorizarMarca(marca: string): CategoriaMarca {
  if (marca.includes('(Vista Frontal)') || marca.includes('(Vista Chanfro/Focinho)')) {
    return 'cabeca';
  }
  if (marca.includes('(Vista Peito/Pescoço)')) {
    // O queixo/ganachas é descrito junto da cabeça; garganta, pescoço e peito
    // entram no "restante do corpo", conforme a divisão em 3 grupos do manual.
    return marca.includes('Queixo / Ganachas') ? 'cabeca' : 'corpo';
  }
  if (marca.includes('(Vista Lateral Esquerda)')) {
    if (marca.includes('Membro Torácico')) return 'membroTE';
    if (marca.includes('Membro Pélvico')) return 'membroPE';
    return 'corpo';
  }
  if (marca.includes('(Vista Lateral Direita)')) {
    if (marca.includes('Membro Torácico')) return 'membroTD';
    if (marca.includes('Membro Pélvico')) return 'membroPD';
    return 'corpo';
  }
  return 'corpo';
}

/** Remove o sufixo "(Vista X)." e normaliza para uma cláusula minúscula, fluida */
function limparClausula(marca: string): string {
  let s = marca
    .replace(/\s*\(Vista[^)]*\)\.?\s*$/i, '')
    .replace(/\(a\)/g, '') // "no(a)" / "do(a)" / "o(a)" -> forma simplificada
    .trim();
  if (s) s = s.charAt(0).toLowerCase() + s.slice(1);
  return s;
}

/** Nas cláusulas de membro, remove a referência ao membro (já dita no parágrafo) */
function limparClausulaMembro(clausula: string): string {
  return clausula
    .replace(/do Membro Torácico \(Anterior\)/g, '')
    .replace(/do Membro Pélvico \(Posterior\)/g, '')
    .replace(/do Membro Torácico/g, '')
    .replace(/do Membro Pélvico/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Junta cláusulas soltas numa frase corrida ("a; b; e c") */
function juntarClausulas(clausulas: string[]): string {
  const validas = clausulas.filter(Boolean);
  if (validas.length === 0) return '';
  if (validas.length === 1) return validas[0];
  return `${validas.slice(0, -1).join('; ')}; e ${validas[validas.length - 1]}`;
}

export function compilarResenhaDescritiva(marcas: string[]): string {
  if (!marcas || marcas.length === 0) {
    return (
      'RESENHA DESCRITIVA ZOOTÉCNICA\n\n' +
      'O animal não apresentou, no momento da inspeção, remoinhos, espigas, marcas brancas, cicatrizes ou outras particularidades gráficas assinaladas pelo técnico resenhador, permanecendo em conformidade com o padrão zootécnico declarado para a pelagem.\n\n' +
      'Observações adicionais do técnico / Resenhador:\n' +
      'Animal inspecionado em condições normais de manejo. Resenha conferida e validada.'
    );
  }

  const grupos: Record<CategoriaMarca, string[]> = {
    cabeca: [], membroTE: [], membroTD: [], membroPE: [], membroPD: [], corpo: [],
  };
  marcas.forEach((marca) => {
    grupos[categorizarMarca(marca)].push(limparClausula(marca));
  });

  let texto = 'RESENHA DESCRITIVA ZOOTÉCNICA\n\n';

  // 1. Cabeça — descrita sempre em primeiro lugar
  texto += grupos.cabeca.length > 0
    ? `Na cabeça, o animal apresenta ${juntarClausulas(grupos.cabeca)}.`
    : 'Na cabeça, não foram identificados remoinhos, espigas ou marcas particulares além do padrão da pelagem.';
  texto += '\n\n';

  // 2. Membros — sempre citados na ordem torácico esquerdo, torácico direito,
  // pélvico esquerdo e pélvico direito, mesmo quando não há particularidades
  const descreverMembro = (lista: string[], nome: string) => {
    const clausulas = lista.map(limparClausulaMembro);
    return clausulas.length > 0
      ? `no ${nome}, ${juntarClausulas(clausulas)}`
      : `no ${nome}, sem particularidades`;
  };

  texto += 'Quanto aos membros: ' +
    `${descreverMembro(grupos.membroTE, 'membro torácico esquerdo')}; ` +
    `${descreverMembro(grupos.membroTD, 'membro torácico direito')}; ` +
    `${descreverMembro(grupos.membroPE, 'membro pélvico esquerdo')}; e ` +
    `${descreverMembro(grupos.membroPD, 'membro pélvico direito')}.`;
  texto += '\n\n';

  // 3. Restante do corpo (pescoço, garganta, tronco, garupa, cicatrizes, etc.)
  texto += grupos.corpo.length > 0
    ? `No restante do corpo, o animal apresenta ${juntarClausulas(grupos.corpo)}.`
    : 'Sem cicatrizes, marcas de ferro ou outras particularidades no restante do corpo.';
  texto += '\n\n';

  texto += 'Observações adicionais do técnico / Resenhador:\n';
  texto += 'Animal inspecionado em condições normais de manejo. Resenha conferida e validada.';

  return texto;
}
