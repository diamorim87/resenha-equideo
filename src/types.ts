export type Especie = 'Equina' | 'Asnina' | 'Muar';

export type Sexo = 'Macho Inteiro' | 'Macho Castrado' | 'Fêmea';

export type ToolType = 'lapis' | 'borracha' | 'carimbo_x' | 'carimbo_espiga';

export type CanvasId = 'canvasLatEsq' | 'canvasLatDir' | 'canvasFrontal' | 'canvasChanfro' | 'canvasPeito';

/**
 * Configuração de uma imagem de fundo (silhueta). `crop` recorta uma sub-região
 * vertical em pixels naturais da imagem de origem — usado quando um único
 * arquivo contém mais de um desenho (ex: cabeça e focinho no mesmo PNG).
 */
export interface SilhuetaBgConfig {
  src: string;
  crop?: {
    naturalWidth: number;
    naturalHeight: number;
    top: number;
    height: number;
  };
  /** Usa máscara "caixa por linha" (sem exigir contorno fechado) — ver silhouetteMask.ts */
  mascaraSimples?: boolean;
}

export interface ResenhaData {
  id?: string;
  dataCriacao: string;
  // Proprietário
  propNome: string;
  propPropriedade?: string;
  propMunicipio: string;
  propUF: string;
  propTel: string;
  // Resenhador
  resNome: string;
  resTel: string;
  resRegistro?: string; // CRMV / ABCCMM / etc
  // Animal
  animNome: string;
  animEspecie: Especie;
  animSexo: Sexo;
  animCor: string; // Pelagem
  animNasc: string;
  animChip?: string;
  animRaca?: string;
  // Descrição
  animDescricao: string;
  // Marcas detectadas
  historicoMarcas: string[];
}

export interface SavedResenha extends ResenhaData {
  id: string;
  dataCriacao: string;
  thumbnails: {
    latEsq?: string;
    latDir?: string;
    frontal?: string;
    chanfro?: string;
  };
}
