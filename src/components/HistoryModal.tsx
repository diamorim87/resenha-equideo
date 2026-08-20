import React from 'react';
import { SavedResenha } from '../types';
import { X, History, Trash2, Calendar, FileText, ArrowRight, User } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedResenhas: SavedResenha[];
  onLoadResenha: (item: SavedResenha) => void;
  onDeleteResenha: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedResenhas,
  onLoadResenha,
  onDeleteResenha,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-4 border-[#8B5A2B]">
        {/* Header */}
        <div className="bg-[#5C3D2E] text-white p-5 flex items-center justify-between border-b-2 border-[#8B5A2B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5A2B] flex items-center justify-center border border-[#D4A373]">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#FAF8F5]">
                Histórico de Resenhas Salvas
              </h3>
              <p className="text-xs text-[#E5D7CC]">
                {savedResenhas.length} {savedResenhas.length === 1 ? 'ficha armazenada' : 'fichas armazenadas'} neste navegador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#8B5A2B] hover:bg-[#A06939] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedResenhas.length === 0 ? (
            <div className="text-center py-12 text-[#7A7A7A]">
              <FileText className="w-12 h-12 mx-auto text-[#D4A373] mb-3 opacity-60" />
              <p className="font-semibold text-base text-[#5C3D2E]">Nenhuma resenha gravada ainda</p>
              <p className="text-xs text-[#8A8A8A] mt-1">
                Ao preencher e avançar na ficha de resenha, seus rascunhos são salvos automaticamente para consulta rápida.
              </p>
            </div>
          ) : (
            savedResenhas.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#EDE6DB] hover:border-[#1B5E20] shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-serif text-[#1B5E20] text-base">
                      {item.animNome || 'Animal Sem Nome'}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold">
                      {item.animEspecie || 'Equina'} • {item.animCor || 'Pelagem não definida'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      Prop: {item.propNome || '-'} ({item.propMunicipio}/{item.propUF})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadResenha(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1B5E20] text-white hover:bg-[#2E7D32] transition-colors"
                  >
                    <span>Carregar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteResenha(item.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Excluir do histórico"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] p-4 border-t border-[#EDE6DB] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-sm bg-[#EDE6DB] text-[#5C3D2E] hover:bg-[#D5C7B5] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
