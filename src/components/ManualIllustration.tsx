import React from 'react';

type Sprite = { file: string; columns: number; rows: number; index: number };

const COAT_SHEETS: Record<string, { files: string[]; columns: number; rows: number; perSheet: number }> = {
  'Cremelo e Branco': { files: ['cremelo-branco.jpg'], columns: 3, rows: 1, perSheet: 3 },
  Preta: { files: ['preta.jpg'], columns: 3, rows: 1, perSheet: 3 },
  'Alazã': { files: ['alaza.jpg'], columns: 3, rows: 2, perSheet: 5 },
  Castanha: { files: ['castanha.jpg'], columns: 3, rows: 2, perSheet: 5 },
  Baia: { files: ['baia.jpg'], columns: 3, rows: 2, perSheet: 6 },
  Tordilha: { files: ['tordilha.jpg'], columns: 3, rows: 2, perSheet: 5 },
  'Asininos e Muares Exclusivos': { files: ['asininos-muares.jpg'], columns: 2, rows: 1, perSheet: 2 },
  'Pelagens Conjugadas e Compostas': {
    files: ['compostas-1.jpg', 'compostas-2.jpg', 'compostas-3.jpg'],
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
    return { file: 'bebe-em-branco.jpg', columns: 1, rows: 1, index: 0 };
  }
  return {
    file: `${tipo}-${Math.floor(index / 4) + 1}.jpg`,
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
    <div
      className={`aspect-square bg-[#F2ECE3] bg-no-repeat ${className}`}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url("/manual-gerado/${sprite.file}")`,
        backgroundSize: `${sprite.columns * 100}% ${sprite.rows * 100}%`,
        backgroundPosition: `${sprite.columns === 1 ? 0 : column / (sprite.columns - 1) * 100}% ${sprite.rows === 1 ? 0 : row / (sprite.rows - 1) * 100}%`,
      }}
    />
  );
};
