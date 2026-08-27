import React from 'react';
import cabecaUrl from '../assets/silhuetas/cabeca-testa-focinho.png';
import lateralUrl from '../assets/silhuetas/lateral-esquerda.png';

/**
 * Diagramas ilustrativos das particularidades do Manual de Confecção de
 * Resenhas, reaproveitando as fotos reais já usadas no app (cabeça e vista
 * lateral) com uma marca esquemática sobreposta — no espírito de um cartaz
 * didático, não uma reprodução fotográfica exata de cada marca.
 */

export type MarcaCabecaId =
  | 'vestigio-estrela'
  | 'estrela'
  | 'luzeiro'
  | 'filete'
  | 'cordao'
  | 'beta'
  | 'ladre'
  | 'bocalvo'
  | 'bebe-em-branco'
  | 'frente-aberta'
  | 'malacara';

export type MarcaCorpoId =
  | 'faixa-crucial'
  | 'listra-de-burro'
  | 'cicatriz'
  | 'golpe-de-lanca'
  | 'marca-de-ferro'
  | 'manchas-brancas'
  | 'bragas';

// Recorte só da cabeça (a imagem completa também traz o focinho isolado e o
// pescoço/peito mais abaixo) — viewBox menor que o natural corta o resto
const CABECA_VIEWBOX = { w: 497, h: 1020 };
const CORPO_VIEWBOX = { w: 999, h: 1003 };

const MARCA_FILL = '#FFFFFF';
const MARCA_STROKE = '#5C3D2E';
const SETA_COR = '#DC2626';

function overlayCabeca(id: MarcaCabecaId): React.ReactNode {
  switch (id) {
    case 'vestigio-estrela':
      return <circle cx={248} cy={330} r={15} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={2.5} strokeDasharray="4,3" />;
    case 'estrela':
      return <ellipse cx={248} cy={330} rx={26} ry={32} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'luzeiro':
      return <ellipse cx={248} cy={335} rx={55} ry={65} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'filete':
      return <rect x={240} y={460} width={16} height={320} rx={8} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'cordao':
      return <rect x={205} y={460} width={86} height={320} rx={14} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'beta':
      return <circle cx={248} cy={790} r={22} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'ladre':
      return (
        <>
          <rect x={215} y={460} width={66} height={280} rx={12} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />
          <ellipse cx={248} cy={790} rx={60} ry={45} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />
        </>
      );
    case 'bocalvo':
      return <ellipse cx={248} cy={880} rx={78} ry={100} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'bebe-em-branco':
      return <ellipse cx={248} cy={965} rx={48} ry={28} fill={MARCA_FILL} stroke={MARCA_STROKE} strokeWidth={3} />;
    case 'frente-aberta':
      return (
        <path
          d="M 248 270 C 205 290, 178 380, 177 500 C 176 630, 179 740, 187 820 C 193 870, 215 925, 248 970 C 281 925, 303 870, 309 820 C 317 740, 320 630, 319 500 C 318 380, 291 290, 248 270 Z"
          fill={MARCA_FILL}
          stroke={MARCA_STROKE}
          strokeWidth={3}
        />
      );
    case 'malacara':
      return (
        <path
          d="M 248 255 C 180 280, 140 380, 138 500 C 136 650, 140 780, 150 870 C 158 930, 190 975, 248 995 C 306 975, 338 930, 346 870 C 356 780, 360 650, 358 500 C 356 380, 316 280, 248 255 Z"
          fill={MARCA_FILL}
          stroke={MARCA_STROKE}
          strokeWidth={3}
        />
      );
    default:
      return null;
  }
}

function overlayCorpo(id: MarcaCorpoId): React.ReactNode {
  const seta = (x: number, y: number, angulo: number) => (
    <g transform={`translate(${x},${y}) rotate(${angulo})`}>
      <line x1={0} y1={0} x2={0} y2={-55} stroke={SETA_COR} strokeWidth={5} strokeLinecap="round" />
      <path d="M -12 -40 L 0 -60 L 12 -40 Z" fill={SETA_COR} />
    </g>
  );
  switch (id) {
    case 'faixa-crucial':
      return <path d="M 415 335 Q 400 375 378 425" fill="none" stroke="#2C2320" strokeWidth={10} strokeLinecap="round" />;
    case 'listra-de-burro':
      return <path d="M 415 335 Q 620 350 800 345 Q 850 344 872 350" fill="none" stroke="#2C2320" strokeWidth={8} strokeLinecap="round" />;
    case 'cicatriz':
      return seta(345, 760, 20);
    case 'golpe-de-lanca':
      return <path d="M 350 400 L 395 400 L 372 445 Z" fill="none" stroke={MARCA_STROKE} strokeWidth={4} />;
    case 'marca-de-ferro':
      return seta(700, 540, -15);
    case 'manchas-brancas':
      return <path d="M 500 390 Q 540 375 590 390 Q 620 420 605 455 Q 570 475 530 460 Q 495 435 500 390 Z" fill="none" stroke={MARCA_STROKE} strokeWidth={3.5} strokeDasharray="6,4" />;
    case 'bragas':
      return <ellipse cx={520} cy={605} rx={70} ry={35} fill={MARCA_FILL} opacity={0.85} stroke={MARCA_STROKE} strokeWidth={3} />;
    default:
      return null;
  }
}

interface MarcaDiagramaProps {
  tipo: 'cabeca' | 'corpo';
  id: MarcaCabecaId | MarcaCorpoId;
  className?: string;
}

// Dimensões naturais dos arquivos de origem (cabeca-testa-focinho.png inteiro
// tem 497x1993 — o viewBox menor acima recorta só a região da cabeça dele)
const CABECA_IMG_NATURAL = { w: 497, h: 1993 };
const CORPO_IMG_NATURAL = { w: 999, h: 1003 };

export const MarcaDiagrama: React.FC<MarcaDiagramaProps> = ({ tipo, id, className }) => {
  const vb = tipo === 'cabeca' ? CABECA_VIEWBOX : CORPO_VIEWBOX;
  const imgNatural = tipo === 'cabeca' ? CABECA_IMG_NATURAL : CORPO_IMG_NATURAL;
  const imgUrl = tipo === 'cabeca' ? cabecaUrl : lateralUrl;

  return (
    <svg
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      className={className ?? 'w-full h-auto rounded-lg border border-[#D4A373] bg-[#FAF8F5]'}
      role="img"
      aria-label={`Diagrama de ${id}`}
    >
      <image href={imgUrl} x={0} y={0} width={imgNatural.w} height={imgNatural.h} />
      {tipo === 'cabeca' ? overlayCabeca(id as MarcaCabecaId) : overlayCorpo(id as MarcaCorpoId)}
    </svg>
  );
};
