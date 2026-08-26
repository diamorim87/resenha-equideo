import { SilhuetaBgConfig } from '../types';
import lateralDireitaUrl from '../assets/silhuetas/lateral-direita.png';
import lateralEsquerdaUrl from '../assets/silhuetas/lateral-esquerda.png';
import cabecaTestaFocinhoUrl from '../assets/silhuetas/cabeca-testa-focinho.png';
import peitoPescocoQueixoUrl from '../assets/silhuetas/peito-pescoco-queixo.png';

/**
 * cabeca-testa-focinho.png contém 2 desenhos empilhados num único arquivo
 * (cabeça e focinho isolado), separados por uma faixa em branco. Os limites
 * abaixo foram medidos pixel a pixel na imagem original (altura total 1993px):
 * cabeça = linhas 0–1614, focinho = linhas 1614–1993.
 */
const CABECA_TESTA_FOCINHO_NATURAL = { width: 497, height: 1993 };
const CABECA_SPLIT_Y = 1614;

export const SILHUETA_BG_CONFIGS: Record<'latEsq' | 'latDir' | 'frontal' | 'chanfro' | 'peito', SilhuetaBgConfig> = {
  latEsq: { src: lateralEsquerdaUrl },
  latDir: { src: lateralDireitaUrl },
  frontal: {
    src: cabecaTestaFocinhoUrl,
    crop: {
      naturalWidth: CABECA_TESTA_FOCINHO_NATURAL.width,
      naturalHeight: CABECA_TESTA_FOCINHO_NATURAL.height,
      top: 0,
      height: CABECA_SPLIT_Y,
    },
  },
  chanfro: {
    src: cabecaTestaFocinhoUrl,
    crop: {
      naturalWidth: CABECA_TESTA_FOCINHO_NATURAL.width,
      naturalHeight: CABECA_TESTA_FOCINHO_NATURAL.height,
      top: CABECA_SPLIT_Y,
      height: CABECA_TESTA_FOCINHO_NATURAL.height - CABECA_SPLIT_Y,
    },
  },
  peito: { src: peitoPescocoQueixoUrl },
};
