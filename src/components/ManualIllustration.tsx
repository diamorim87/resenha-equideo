import React from 'react';

type Sprite = { file: string; columns: number; rows: number; index: number };

const COAT_SHEETS: Record<string, { files: string[]; columns: number; rows: number; perSheet: number }> = {
  'Cremelo e Branco': { files: ['cremelo-branco.png'], columns: 3, rows: 1, perSheet: 3 },
  Preta: { files: ['preta.png'], columns: 3, rows: 1, perSheet: 3 },
  'Alazã': { files: ['alaza.png'], columns: 3, rows: 2, perSheet: 5 },
  Castanha: { files: ['castanha.png'], columns: 3, rows: 2, perSheet: 5 },
  Baia: { files: ['baia.png'], columns: 3, rows: 2, perSheet: 6 },
  Tordilha: { files: ['tordilha.png'], columns: 3, rows: 2, perSheet: 5 },
  'Asininos e Muares Exclusivos': { files: ['asininos-muares.png'], columns: 2, rows: 1, perSheet: 2 },
  'Pelagens Conjugadas e Compostas': {
    files: ['compostas-1.png', 'compostas-2.png', 'compostas-3.png'],
    columns: 3, rows: 2, perSheet: 5,
  },
};

export function pelagemSprite(grupo: string, index: number): Sprite {
  const sheet = COAT_SHEETS[grupo];
  if (!sheet) throw new Error(`Prancha de pelagem não encontrada: ${grupo}`);
  return {
    file: sheet.files[Math.floor(index / sheet.perSheet)],
    columns: sheet.columns,
    rows: sheet.rows,
    index: index % sheet.perSheet,
  };
}

export function marcaSprite(tipo: 'cabeca' | 'corpo', index: number): Sprite {
  if (tipo === 'cabeca' && index === 8) {
    return { file: 'bebe-em-branco.png', columns: 1, rows: 1, index: 0 };
  }
  return {
    file: `${tipo}-${Math.floor(index / 4) + 1}.png`,
    columns: 2,
    rows: 2,
    index: index % 4,
  };
}

interface ManualIllustrationProps {
  sprite: Sprite;
  alt: string;
  className?: string;
}

/** Recorta um quadro de uma prancha sem criar cópias do arquivo em cada card. */
export const ManualIllustration: React.FC<ManualIllustrationProps> = ({ sprite, alt, className = '' }) => {
  const column = sprite.index % sprite.columns;
  const row = Math.floor(sprite.index / sprite.columns);
  return (
    <div className={`relative aspect-square overflow-hidden bg-[#F2ECE3] ${className}`} role="img" aria-label={alt}>
      <img
        src={`/manual-gerado/${sprite.file}`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute max-w-none"
        style={{
          width: `${sprite.columns * 100}%`,
          height: `${sprite.rows * 100}%`,
          left: `-${column * 100}%`,
          top: `-${row * 100}%`,
        }}
      />
    </div>
  );
};
