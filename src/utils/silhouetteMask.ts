import { SilhuetaBgConfig } from '../types';

/**
 * Calcula uma máscara binária (1 = dentro do desenho do cavalo, 0 = fora)
 * a partir da imagem de fundo, para impedir que marcações sejam registradas
 * fora da silhueta (ex: no espaço em branco ao redor do animal).
 *
 * Como as ilustrações são line-art (fundo branco/transparente, contorno
 * escuro, interior também vazio), não dá para usar "é branco?" para decidir
 * dentro/fora — o interior do cavalo também é branco. Em vez disso, fazemos
 * um flood-fill a partir das bordas da imagem: tudo que o flood-fill alcança
 * sem atravessar o contorno é "fora"; o contorno em si e tudo que fica
 * fechado por ele (não alcançado) é "dentro".
 */
export async function calcularMascaraSilhueta(
  bg: SilhuetaBgConfig,
  largura: number,
  altura: number
): Promise<Uint8Array> {
  // Fail-safe: se algo der errado (imagem não carrega, canvas "tainted" etc.),
  // a máscara libera tudo — nunca travamos o desenho por causa da máscara.
  const mascara = new Uint8Array(largura * altura).fill(1);

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = largura;
        offscreen.height = altura;
        const ctx = offscreen.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve();
          return;
        }

        if (bg.crop) {
          ctx.drawImage(
            img,
            0, bg.crop.top, bg.crop.naturalWidth, bg.crop.height,
            0, 0, largura, altura
          );
        } else {
          ctx.drawImage(img, 0, 0, largura, altura);
        }

        const { data } = ctx.getImageData(0, 0, largura, altura);
        const ehFundo = (idx: number) => {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          const a = data[idx * 4 + 3];
          return a < 10 || (r > 235 && g > 235 && b > 235);
        };

        const alcancado = new Uint8Array(largura * altura); // 1 = fora (flood-fill chegou)
        const fila = new Int32Array(largura * altura);
        let cauda = 0;

        const empilhar = (x: number, y: number) => {
          if (x < 0 || y < 0 || x >= largura || y >= altura) return;
          const idx = y * largura + x;
          if (alcancado[idx] || !ehFundo(idx)) return;
          alcancado[idx] = 1;
          fila[cauda++] = idx;
        };

        for (let x = 0; x < largura; x++) {
          empilhar(x, 0);
          empilhar(x, altura - 1);
        }
        for (let y = 0; y < altura; y++) {
          empilhar(0, y);
          empilhar(largura - 1, y);
        }

        let cabeca = 0;
        while (cabeca < cauda) {
          const idx = fila[cabeca++];
          const x = idx % largura;
          const y = (idx / largura) | 0;
          empilhar(x + 1, y);
          empilhar(x - 1, y);
          empilhar(x, y + 1);
          empilhar(x, y - 1);
        }

        for (let i = 0; i < largura * altura; i++) {
          mascara[i] = alcancado[i] ? 0 : 1;
        }
      } catch {
        // getImageData pode falhar (CORS/tainted canvas) — mantém tudo liberado
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = bg.src;
  });

  return mascara;
}

/** Consulta a máscara na posição (x, y) em pixels do canvas; fail-open se ainda não calculada */
export function estaDentroDaSilhueta(
  mascara: Uint8Array | undefined,
  largura: number,
  altura: number,
  x: number,
  y: number
): boolean {
  if (!mascara) return true;
  const ix = Math.round(x);
  const iy = Math.round(y);
  if (ix < 0 || iy < 0 || ix >= largura || iy >= altura) return false;
  return mascara[iy * largura + ix] === 1;
}
