import React, { useState } from 'react';
import { ResenhaData } from '../types';
import {
  FileText,
  Download,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Building,
  User,
  Calendar,
  Layers,
  Award,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Toast, ToastState } from './Toast';

interface Step3ReviewProps {
  data: ResenhaData;
  onChangeDescricao: (text: string) => void;
  onGeneratePdf: () => Promise<void>;
  onBack: () => void;
  onReset: () => void;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({
  data,
  onChangeDescricao,
  onGeneratePdf,
  onBack,
  onReset,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      await onGeneratePdf();
      setDownloadSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1B5E20', '#8B5A2B', '#2E7D32', '#D4A373'],
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setToast({ mensagem: 'Ocorreu um erro ao gerar o PDF. Verifique os dados e tente novamente.', tipo: 'erro' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* CARD PRINCIPAL DE RESUMO E EDITAR RESENHA */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#EDE6DB]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-[#E8F5E9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#1B5E20]">
                Ficha de Resenha Zootécnica
              </h2>
              <p className="text-xs text-[#6B7280]">
                Confira o laudo descritivo e faça os ajustes necessários antes de emitir o PDF
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-[#F5EBE6] text-[#8B5A2B] rounded-full border border-[#D4A373]">
            <Award className="w-3.5 h-3.5" />
            Padrão Zootécnico
          </span>
        </div>

        {/* Resumo Rápido dos Dados */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB] mb-6 text-xs">
          <div>
            <span className="text-[#8B5A2B] font-bold block">Animal:</span>
            <span className="text-[#1F2937] font-semibold text-sm">{data.animNome || 'Não informado'}</span>
          </div>
          <div>
            <span className="text-[#8B5A2B] font-bold block">Pelagem Oficial:</span>
            <span className="text-[#1F2937] font-medium">{data.animCor || 'Não informada'}</span>
          </div>
          <div>
            <span className="text-[#8B5A2B] font-bold block">Espécie / Sexo:</span>
            <span className="text-[#1F2937] font-medium">
              {data.animEspecie} • {data.animSexo || '-'}
            </span>
          </div>
          <div>
            <span className="text-[#8B5A2B] font-bold block">Proprietário:</span>
            <span className="text-[#1F2937] font-medium">
              {data.propNome || '-'} ({data.propMunicipio}/{data.propUF})
            </span>
          </div>
        </div>

        {/* Campo de Texto da Resenha Descritiva */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="animDescricao" className="text-sm font-bold text-[#1B5E20] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
              Resenha Descritiva e Particularidades Anatômicas
            </label>
            <span className="text-xs text-[#6B7280]">
              Texto livremente editável
            </span>
          </div>
          <textarea
            id="animDescricao"
            rows={10}
            value={data.animDescricao}
            onChange={(e) => onChangeDescricao(e.target.value)}
            placeholder="Descreva as marcas anatômicas, calçados, rodopios, espigas, estrelas ou outras particularidades..."
            className="w-full p-4 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-base leading-relaxed font-sans transition-all"
          />
          <p className="text-xs text-[#6B7280] mt-1.5">
            Este texto foi compilado automaticamente pelo motor zootécnico com base nos seus traços gráficos. Você pode complementar com observações veterinárias.
          </p>
        </div>
      </div>

      {/* FEEDBACK DE SUCESSO DEPOIS DO DOWNLOAD */}
      {downloadSuccess && (
        <div className="bg-[#E8F5E9] border-2 border-[#2E7D32] p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1B5E20]">PDF gerado com sucesso!</h4>
              <p className="text-xs text-[#2E7D32]">
                A ficha com os desenhos e a descrição foi baixada no seu dispositivo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTÕES DE AÇÃO */}
      <div className="space-y-3">
        <button
          type="button"
          id="btn-baixar-pdf-final"
          disabled={isGenerating}
          onClick={handleDownload}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-lg font-bold bg-[#1B5E20] text-white hover:bg-[#2E7D32] border-2 border-[#8B5A2B] shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.015] active:scale-95 disabled:opacity-75 disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Preparando sua ficha...</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6 text-[#A5D6A7]" />
              <span>Baixar ficha em PDF</span>
            </>
          )}
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            id="btn-voltar-etapa2"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#5C3D2E] text-white hover:bg-[#6D4937] border border-[#8B5A2B] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Desenhos</span>
          </button>

          <button
            type="button"
            id="btn-apagar-tudo-recomecar"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#EF4444] text-white hover:bg-[#DC2626] border border-red-600 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Apagar Tudo e Recomeçar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
