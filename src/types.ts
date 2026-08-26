export type Especie = 'Equina' | 'Asnina' | 'Muar';

export type Sexo = 'Macho Inteiro' | 'Macho Castrado' | 'Fêmea';

export type ToolType = 'lapis' | 'borracha' | 'carimbo_x' | 'carimbo_edir' | 'carimbo_eesq';

export type CanvasId = 'canvasLatEsq' | 'canvasLatDir' | 'canvasFrontal' | 'canvasChanfro';

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
