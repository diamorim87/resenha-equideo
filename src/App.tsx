import React, { useState, useRef, useEffect } from 'react';
import { ResenhaData, SavedResenha } from './types';
import { SILHUETA_BG_CONFIGS } from './utils/silhouetteAssets';
import { compilarResenhaDescritiva } from './utils/anatomicalEngine';
import { gerarPdfResenha } from './utils/pdfGenerator';
import { Navbar } from './components/Navbar';
import { StepIndicator } from './components/StepIndicator';
import { Step1Data } from './components/Step1Data';
import { Step2Graphics } from './components/Step2Graphics';
import { Step3Review } from './components/Step3Review';
import { GuideModal } from './components/GuideModal';
import { HistoryModal } from './components/HistoryModal';
import { Toast, ToastState } from './components/Toast';

const INITIAL_DATA: ResenhaData = {
  dataCriacao: new Date().toISOString(),
  propNome: '',
  propPropriedade: '',
  propMunicipio: '',
  propUF: '',
  propTel: '',
  resNome: '',
  resTel: '',
  resRegistro: '',
  animNome: '',
  animEspecie: 'Equina',
  animSexo: 'Macho Inteiro',
  animCor: '',
  animNasc: '',
  animRaca: '',
  animChip: '',
  animDescricao: '',
  historicoMarcas: [],
};

const STORAGE_KEY = 'amorimpec_resenhas_v1';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<ResenhaData>(INITIAL_DATA);
  const [historicoMarcas, setHistoricoMarcas] = useState<string[]>([]);
  // true assim que o resenhador digitar qualquer coisa no campo de texto da
  // Etapa 3 — a partir daí a regeneração automática do texto (ao adicionar
  // novas marcas e voltar à Etapa 3) NUNCA mais sobrescreve o que foi editado
  const [descricaoEditadaManualmente, setDescricaoEditadaManualmente] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [savedResenhas, setSavedResenhas] = useState<SavedResenha[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Referências para os 5 canvases
  const canvasLatEsq = useRef<HTMLCanvasElement | null>(null);
  const canvasLatDir = useRef<HTMLCanvasElement | null>(null);
  const canvasFrontal = useRef<HTMLCanvasElement | null>(null);
  const canvasChanfro = useRef<HTMLCanvasElement | null>(null);
  const canvasPeito = useRef<HTMLCanvasElement | null>(null);

  // Snapshots dos desenhos (PNG data URL), capturados antes dos canvases serem
  // desmontados ao sair da Etapa 2 — necessários para o PDF, já que as refs viram
  // null assim que o componente Step2Graphics deixa de ser renderizado.
  const [desenhosSnapshot, setDesenhosSnapshot] = useState<{
    latEsq: string | null;
    latDir: string | null;
    frontal: string | null;
    chanfro: string | null;
    peito: string | null;
  }>({ latEsq: null, latDir: null, frontal: null, chanfro: null, peito: null });

  // Carrega histórico do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedResenhas(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Erro ao ler localStorage', e);
    }
  }, []);

  // Salva no localStorage quando há mudanças relevantes
  const salvarNoHistoricoLocal = (resenhaParaSalvar: ResenhaData) => {
    if (!resenhaParaSalvar.animNome && !resenhaParaSalvar.propNome) return;
    try {
      const item: SavedResenha = {
        ...resenhaParaSalvar,
        id: resenhaParaSalvar.id || `res_${Date.now()}`,
        dataCriacao: resenhaParaSalvar.dataCriacao || new Date().toISOString(),
        thumbnails: {},
      };

      setSavedResenhas((prev) => {
        const filtered = prev.filter((p) => p.id !== item.id);
        const updated = [item, ...filtered].slice(0, 20); // guarda até 20 fichas
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Erro ao salvar no histórico', e);
    }
  };

  const handleFieldChange = (field: keyof ResenhaData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler dedicado ao textarea da resenha descritiva: marca a descrição como
  // editada manualmente, para nunca mais ser sobrescrita pela regeneração automática
  const handleChangeDescricao = (text: string) => {
    setDescricaoEditadaManualmente(true);
    handleFieldChange('animDescricao', text);
  };

  // Captura o desenho atual de cada canvas como PNG antes da Etapa 2 ser desmontada
  const capturarDesenhosAtuais = () => {
    setDesenhosSnapshot({
      latEsq: canvasLatEsq.current ? canvasLatEsq.current.toDataURL('image/png') : null,
      latDir: canvasLatDir.current ? canvasLatDir.current.toDataURL('image/png') : null,
      frontal: canvasFrontal.current ? canvasFrontal.current.toDataURL('image/png') : null,
      chanfro: canvasChanfro.current ? canvasChanfro.current.toDataURL('image/png') : null,
      peito: canvasPeito.current ? canvasPeito.current.toDataURL('image/png') : null,
    });
  };

  // Navegação entre passos
  const handleStepClick = (targetStep: number) => {
    if (targetStep > 1 && currentStep === 1) {
      if (!data.propNome || !data.propMunicipio || !data.propUF || !data.propTel || !data.resNome || !data.resTel || !data.animNome || !data.animCor || !data.animNasc) {
        setToast({ mensagem: 'Preencha os campos obrigatórios marcados com * antes de prosseguir.', tipo: 'erro' });
        return;
      }
    }

    if (currentStep === 2 && targetStep !== 2) {
      capturarDesenhosAtuais();
    }

    if (targetStep === 3 && currentStep !== 3) {
      prepararResenhaDescritiva();
    }

    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const avancarParaEtapa2 = () => {
    salvarNoHistoricoLocal(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prepararResenhaDescritiva = () => {
    // Só (re)gera o texto automaticamente enquanto o resenhador não tiver
    // editado nada manualmente — depois disso, a edição dele é definitiva
    if (descricaoEditadaManualmente) return;
    const textoCompilado = compilarResenhaDescritiva(historicoMarcas);
    setData((prev) => ({ ...prev, animDescricao: textoCompilado }));
  };

  const avancarParaEtapa3 = () => {
    capturarDesenhosAtuais();
    prepararResenhaDescritiva();
    salvarNoHistoricoLocal({ ...data, historicoMarcas });
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGeneratePdf = async () => {
    salvarNoHistoricoLocal({ ...data, historicoMarcas });
    await gerarPdfResenha({
      data: { ...data, historicoMarcas },
      desenhos: desenhosSnapshot,
      bgImages: SILHUETA_BG_CONFIGS,
    });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja apagar os dados da ficha atual e recomeçar?')) {
      // Limpa os canvases
      [canvasLatEsq, canvasLatDir, canvasFrontal, canvasChanfro, canvasPeito].forEach((ref) => {
        if (ref.current) {
          const ctx = ref.current.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, ref.current.width, ref.current.height);
        }
      });
      setData({ ...INITIAL_DATA, dataCriacao: new Date().toISOString() });
      setHistoricoMarcas([]);
      setDesenhosSnapshot({ latEsq: null, latDir: null, frontal: null, chanfro: null, peito: null });
      setDescricaoEditadaManualmente(false);
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadFromHistory = (item: SavedResenha) => {
    setData(item);
    setHistoricoMarcas(item.historicoMarcas || []);
    // Uma ficha carregada já tem uma descrição própria (gerada ou editada) —
    // trata como "manual" para não ser sobrescrita ao passar pela Etapa 3 de novo
    setDescricaoEditadaManualmente(true);
    setCurrentStep(1);
  };

  const handleDeleteFromHistory = (id: string) => {
    setSavedResenhas((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C3E50] font-sans selection:bg-[#2E7D32] selection:text-white flex flex-col">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Barra de Navegação Superior */}
      <Navbar
        onNew={handleReset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        isMenuOpen={isMenuOpen}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Indicador de Passos */}
        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Passo 1: Dados do Proprietário, Resenhador e Animal */}
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-200">
            <Step1Data
              data={data}
              onChange={handleFieldChange}
              onNext={avancarParaEtapa2}
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          </div>
        )}

        {/* Passo 2: Resenha Gráfica (Canvases Interativos) */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-200">
            <Step2Graphics
              canvasRefs={{
                latEsq: canvasLatEsq,
                latDir: canvasLatDir,
                frontal: canvasFrontal,
                chanfro: canvasChanfro,
                peito: canvasPeito,
              }}
              bgConfigs={SILHUETA_BG_CONFIGS}
              historicoMarcas={historicoMarcas}
              setHistoricoMarcas={setHistoricoMarcas}
              initialDesenhos={desenhosSnapshot}
              onNext={avancarParaEtapa3}
              onBack={() => {
                capturarDesenhosAtuais();
                setCurrentStep(1);
              }}
            />
          </div>
        )}

        {/* Passo 3: Resenha Descritiva Final & Laudo em PDF */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-200">
            <Step3Review
              data={data}
              onChangeDescricao={handleChangeDescricao}
              onGeneratePdf={handleGeneratePdf}
              onBack={() => setCurrentStep(2)}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      {/* Rodapé Institucional com Estilo Rural Brasileiro */}
      <footer className="bg-[#1B5E20] text-white border-t-4 border-[#8B5A2B] mt-12 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C8E6C9]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-xl">🐴</span>
            <div>
              <p className="font-bold text-white text-sm">Amorimpec • Zootecnia & Resenha Equina</p>
              <p>Padrão oficial brasileiro para equinos, asininos e muares.</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p>Em conformidade com as normas zootécnicas e manuais veterinários</p>
            <p className="text-[#A5D6A7]">Desenho gráfico vetorial e geração de laudo PDF</p>
          </div>
        </div>
      </footer>

      {/* Modais de Suporte */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedResenhas={savedResenhas}
        onLoadResenha={handleLoadFromHistory}
        onDeleteResenha={handleDeleteFromHistory}
      />
    </div>
  );
}
