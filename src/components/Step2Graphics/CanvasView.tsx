import React from 'react';
import { Trash2, Tag } from 'lucide-react';

export interface CanvasViewConfig {
  domId: string;
  titulo: string;
  legenda: string;
  clearLabel: string;
  ref: React.RefObject<HTMLCanvasElement | null>;
  bgSrc: string;
  bgAlt: string;
  width: number;
  height: number;
  maxWidthClass: string;
  aspectClass: string;
  onClear: () => void;
}

export const CanvasView: React.FC<{ config: CanvasViewConfig }> = ({ config }) => {
  const {
    domId,
    titulo,
    legenda,
    clearLabel,
    ref,
    bgSrc,
    bgAlt,
    width,
    height,
    maxWidthClass,
    aspectClass,
    onClear,
  } = config;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EDE6DB] flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-sm font-bold font-serif text-[#1B5E20] flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-[#8B5A2B]" />
          {titulo}
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {clearLabel}
        </button>
      </div>

      <div
        className={`relative w-full ${maxWidthClass} ${aspectClass} rounded-xl overflow-hidden border-2 border-[#D4A373] bg-[#FAF8F5] shadow-inner`}
      >
        <img
          src={bgSrc}
          alt={bgAlt}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        />
        <canvas
          ref={ref}
          id={domId}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>
      <p className="text-[11px] text-[#8B5A2B] mt-2 text-center">{legenda}</p>
    </div>
  );
};
