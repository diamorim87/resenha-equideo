import { SilhuetaBgConfig } from '../types';

export interface MascaraSilhueta {
  dados: Uint8Array;
  largura: number;
  altura: number;
}

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
 *
 * O flood-fill roda na resolução NATURAL da imagem (não na resolução, bem
 * menor, do canvas de desenho) — em recortes finos como o pescoço da vista
 * de Peito/Pescoço/Queixo, desenhar numa resolução pequena antialiasa o
 * contorno fino a ponto de "abrir brechas" nele, deixando o flood-fill
 * vazar para dentro e derrubando marcações válidas na maior parte da vista.
 */
export async function calcularMascaraSilhueta(bg: SilhuetaBgConfig): Promise<MascaraSilhueta> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const largura = bg.crop ? bg.crop.naturalWidth : img.naturalWidth;
      const altura = bg.crop ? bg.crop.height : img.naturalHeight;
      // Fail-safe: se algo der errado, a máscara libera tudo — nunca trava o desenho
      const mascaraLiberada: MascaraSilhueta = { dados: new Uint8Array(largura * altura).fill(1), largura, altura };

      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = largura;
        offscreen.height = altura;
        const ctx = offscreen.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(mascaraLiberada);
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

        let dados: Uint8Array;

        if (bg.mascaraSimples) {
          // Modo "caixa por linha": em vez de exigir um contorno fechado,
          // considera "dentro" tudo que fica entre o traço mais à esquerda e
          // o mais à direita de cada linha. Usado em ilustrações-guia (como
          // Peito/Pescoço/Queixo) que têm traços soltos/abertos em vez de
          // uma silhueta fechada — o flood-fill classificaria erradamente
          // quase tudo como "fora" por não haver um contorno fechado ali.
          dados = new Uint8Array(largura * altura);
          for (let y = 0; y < altura; y++) {
            let minX = -1;
            let maxX = -1;
            for (let x = 0; x < largura; x++) {
              if (!ehFundo(y * largura + x)) {
                if (minX === -1) minX = x;
                maxX = x;
              }
            }
            if (minX !== -1) {
              for (let x = minX; x <= maxX; x++) dados[y * largura + x] = 1;
            }
          }
        } else {
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

          dados = new Uint8Array(largura * altura);
          for (let i = 0; i < largura * altura; i++) {
            dados[i] = alcancado[i] ? 0 : 1;
          }
        }

        resolve({ dados, largura, altura });
      } catch {
        // getImageData pode falhar (CORS/tainted canvas) — mantém tudo liberado
        resolve(mascaraLiberada);
      }
    };
    img.onerror = () => resolve({ dados: new Uint8Array(0), largura: 0, altura: 0 });
    img.src = bg.src;
  });
}

/**
 * Consulta a máscara numa posição em pixels do CANVAS de desenho (que pode
 * ter resolução diferente da máscara), convertendo proporcionalmente antes
 * de indexar. Fail-open (permite o traço) se a máscara ainda não carregou.
 */
export function estaDentroDaSilhueta(
  mascara: MascaraSilhueta | undefined,
  canvasLargura: number,
  canvasAltura: number,
  x: number,
  y: number
): boolean {
  if (!mascara || mascara.largura === 0) return true;
  const mx = Math.floor((x / canvasLargura) * mascara.largura);
  const my = Math.floor((y / canvasAltura) * mascara.altura);
  if (mx < 0 || my < 0 || mx >= mascara.largura || my >= mascara.altura) return false;
  return mascara.dados[my * mascara.largura + mx] === 1;
}
