import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export interface ToastState {
  mensagem: string;
  tipo?: 'erro' | 'sucesso';
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

/**
 * Notificação flutuante no topo da tela — substitui o alert() nativo do
 * navegador, que interrompe a execução e destoa visualmente durante uma
 * demonstração ao vivo. Fecha sozinha depois de alguns segundos.
 */
export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isErro = toast.tipo !== 'sucesso';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto z-[100] flex justify-center sm:justify-end animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div
        className={`flex items-start gap-3 w-full sm:w-auto sm:max-w-sm rounded-2xl border-2 shadow-xl px-4 py-3.5 backdrop-blur-sm ${
          isErro
            ? 'bg-[#FEF2F2]/95 border-[#EF4444] text-[#991B1B]'
            : 'bg-[#E8F5E9]/95 border-[#2E7D32] text-[#1B5E20]'
        }`}
      >
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white ${
            isErro ? 'bg-[#EF4444]' : 'bg-[#2E7D32]'
          }`}
        >
          {isErro ? <AlertTriangle className="w-4.5 h-4.5" /> : <CheckCircle2 className="w-4.5 h-4.5" />}
        </div>
        <p className="text-sm font-semibold leading-snug pt-1">{toast.mensagem}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar aviso"
          className="ml-auto shrink-0 p-1 rounded-lg text-current/70 hover:bg-black/5 hover:text-current transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
