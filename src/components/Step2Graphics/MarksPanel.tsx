import React from 'react';
import { Wand2, Trash2 } from 'lucide-react';

interface MarksPanelProps {
  historicoMarcas: string[];
  onClearAll: () => void;
  onRemove: (index: number) => void;
}

export const MarksPanel: React.FC<MarksPanelProps> = ({
  historicoMarcas,
  onClearAll,
  onRemove,
}) => {
  return (
    <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border-2 border-[#D5C7B5] shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EDE6DB]">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-[#8B5A2B]" />
          <h3 className="text-base font-bold font-serif text-[#1B5E20]">
            Particularidades Anatômicas Reconhecidas ({historicoMarcas.length})
          </h3>
        </div>
        {historicoMarcas.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:underline"
          >
            Limpar todas as anotações
          </button>
        )}
      </div>

      {historicoMarcas.length === 0 ? (
        <p className="text-sm text-[#7A7A7A] italic py-2">
          Nenhuma marca assinalada até o momento. Utilize os lápis e carimbos anatômicos sobre as silhuetas acima para registrar as características do animal.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
          {historicoMarcas.map((marca, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#EDE6DB] text-xs text-[#2C3E50] shadow-2xs hover:border-[#1B5E20]/40"
            >
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-[#8B5A2B]">•</span>
                <span className="leading-tight">{marca}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-gray-400 hover:text-red-500 p-0.5"
                title="Remover anotação"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
