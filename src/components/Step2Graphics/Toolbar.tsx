import React from 'react';
import { ToolType } from '../../types';
import { PenTool, Eraser, CheckCircle2 } from 'lucide-react';

interface ToolbarProps {
  ferramenta: ToolType;
  cor: string;
  espessura: number;
  anguloEspiga: number;
  ultimaMarca: string | null;
  onSelectLapis: (cor: string) => void;
  onSelectBorracha: () => void;
  onSelectCarimbo: (tool: ToolType) => void;
  onEspessuraChange: (value: number) => void;
  onAnguloEspigaChange: (angulo: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  ferramenta,
  cor,
  espessura,
  anguloEspiga,
  ultimaMarca,
  onSelectLapis,
  onSelectBorracha,
  onSelectCarimbo,
  onEspessuraChange,
  onAnguloEspigaChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-[#8B5A2B]/40 sm:sticky sm:top-20 z-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Seletor de Cores / Traço */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C3D2E] mr-1">
            Cor do Traço:
          </span>

          {/* Preto */}
          <button
            type="button"
            id="tool-cor-preto"
            onClick={() => onSelectLapis('black')}
            title="Marcação Escura / Calçado Preto"
            className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
              ferramenta === 'lapis' && cor === 'black'
                ? 'ring-4 ring-[#8B5A2B] scale-110 bg-[#1F2937]'
                : 'bg-[#2D3748] hover:scale-105'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Vermelho */}
          <button
            type="button"
            id="tool-cor-vermelho"
            onClick={() => onSelectLapis('red')}
            title="Cicatriz / Ferida / Marca a Fogo"
            className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
              ferramenta === 'lapis' && cor === 'red'
                ? 'ring-4 ring-[#8B5A2B] scale-110 bg-[#DC2626]'
                : 'bg-[#EF4444] hover:scale-105'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Marrom */}
          <button
            type="button"
            id="tool-cor-marrom"
            onClick={() => onSelectLapis('saddlebrown')}
            title="Mancha Castanha / Alazã"
            className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
              ferramenta === 'lapis' && cor === 'saddlebrown'
                ? 'ring-4 ring-[#1B5E20] scale-110 bg-[#5C3D2E]'
                : 'bg-[#8B5A2B] hover:scale-105'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Branco */}
          <button
            type="button"
            id="tool-cor-branco"
            onClick={() => onSelectLapis('white')}
            title="Mancha Branca / Calçado / Luzeiro Despigmentado"
            className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#5C3D2E] border-2 border-[#D4A373] transition-all shadow-sm ${
              ferramenta === 'lapis' && cor === 'white'
                ? 'ring-4 ring-[#1B5E20] scale-110 bg-white font-bold'
                : 'bg-[#FAF8F5] hover:scale-105'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Borracha */}
          <button
            type="button"
            id="tool-borracha"
            onClick={onSelectBorracha}
            title="Borracha (Apagar Traços)"
            className={`px-3 min-h-11 sm:min-h-0 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
              ferramenta === 'borracha'
                ? 'bg-[#5C3D2E] text-white ring-2 ring-[#8B5A2B] scale-105'
                : 'bg-[#EDE6DB] text-[#5C3D2E] hover:bg-[#D5C7B5]'
            }`}
          >
            <Eraser className="w-4 h-4" />
            Borracha
          </button>
        </div>

        {/* Carimbos Anatômicos Zootécnicos */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5C3D2E] mr-1">
            Símbolos:
          </span>

          <button
            type="button"
            id="tool-carimbo-x"
            onClick={() => onSelectCarimbo('carimbo_x')}
            title="Rodopio de Pelos"
            className={`px-3 min-h-11 sm:min-h-0 sm:py-1.5 rounded-lg text-xs font-bold border transition-all ${
              ferramenta === 'carimbo_x'
                ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-105'
                : 'bg-[#FAF8F5] text-[#1B5E20] border-[#C8E6C9] hover:bg-[#E8F5E9]'
            }`}
          >
            <span className="font-mono text-sm">X</span> (Rodopio)
          </button>

          <button
            type="button"
            id="tool-carimbo-espiga"
            onClick={() => onSelectCarimbo('carimbo_espiga')}
            title="Espiga (gire a seta abaixo para a direção correta)"
            className={`px-3 min-h-11 sm:min-h-0 sm:py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              ferramenta === 'carimbo_espiga'
                ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-105'
                : 'bg-[#FAF8F5] text-[#1B5E20] border-[#C8E6C9] hover:bg-[#E8F5E9]'
            }`}
          >
            <span
              className="inline-block font-mono"
              style={{ transform: `rotate(${anguloEspiga}deg)`, display: 'inline-block' }}
            >
              → E
            </span>
            (Espiga)
          </button>

          {ferramenta === 'carimbo_espiga' && (
            <div className="flex items-center gap-2 bg-[#E8F5E9] px-3 py-1.5 rounded-xl border border-[#C8E6C9]">
              <span className="text-xs font-bold text-[#1B5E20]">Direção:</span>
              <input
                type="range"
                id="anguloEspiga"
                min="0"
                max="359"
                value={anguloEspiga}
                onChange={(e) => onAnguloEspigaChange(Number(e.target.value))}
                className="w-24 accent-[#1B5E20] cursor-pointer"
                aria-label="Ângulo de rotação da espiga"
              />
              <span className="text-xs font-mono font-bold text-[#1B5E20] w-9 text-center">
                {anguloEspiga}°
              </span>
            </div>
          )}
        </div>

        {/* Controle de Espessura */}
        <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EDE6DB]">
          <span className="text-xs font-bold text-[#5C3D2E]">Espessura:</span>
          <input
            type="range"
            id="espessuraCaneta"
            min="1"
            max="15"
            value={espessura}
            onChange={(e) => onEspessuraChange(Number(e.target.value))}
            className="w-24 accent-[#1B5E20] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#1B5E20] w-5 text-center">
            {espessura}px
          </span>
        </div>
      </div>

      {/* Notificação sutil da última marca anatômica detectada */}
      {ultimaMarca && (
        <div className="mt-3 pt-3 border-t border-[#EDE6DB] flex items-center justify-between text-xs text-[#1B5E20] bg-[#E8F5E9]/60 px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Região Detectada: <strong>{ultimaMarca}</strong></span>
          </div>
          <span className="text-[11px] text-[#2E7D32]">Adicionada à resenha</span>
        </div>
      )}
    </div>
  );
};
