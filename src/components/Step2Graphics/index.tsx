import React, { useState } from 'react';
import { ToolType, SilhuetaBgConfig } from '../../types';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { useCanvasDrawing, CanvasRefsMap } from './useCanvasDrawing';
import { Toolbar } from './Toolbar';
import { CanvasView, CanvasViewConfig } from './CanvasView';
import { MarksPanel } from './MarksPanel';

interface Step2GraphicsProps {
  canvasRefs: CanvasRefsMap;
  bgConfigs: {
    latEsq: SilhuetaBgConfig;
    latDir: SilhuetaBgConfig;
    frontal: SilhuetaBgConfig;
    chanfro: SilhuetaBgConfig;
    peito: SilhuetaBgConfig;
  };
  historicoMarcas: string[];
  setHistoricoMarcas: React.Dispatch<React.SetStateAction<string[]>>;
  initialDesenhos?: {
    latEsq: string | null;
    latDir: string | null;
    frontal: string | null;
    chanfro: string | null;
    peito: string | null;
  };
  onNext: () => void;
  onBack: () => void;
}

export const Step2Graphics: React.FC<Step2GraphicsProps> = ({
  canvasRefs,
  bgConfigs,
  historicoMarcas,
  setHistoricoMarcas,
  initialDesenhos,
  onNext,
  onBack,
}) => {
  const [ferramenta, setFerramenta] = useState<ToolType>('lapis');
  const [cor, setCor] = useState<string>('black');
  const [espessura, setEspessura] = useState<number>(4);

  const { ultimaMarca } = useCanvasDrawing({
    canvasRefs,
    bgConfigs,
    ferramenta,
    cor,
    espessura,
    historicoMarcas,
    setHistoricoMarcas,
    initialDesenhos,
  });

  const handleLimparCanvas = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    vistaNome: string
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistoricoMarcas((prev) => prev.filter((m) => !m.includes(vistaNome)));
  };

  const handleRemoverMarca = (index: number) => {
    setHistoricoMarcas((prev) => prev.filter((_, i) => i !== index));
  };

  const vistasPrincipais: CanvasViewConfig[] = [
    {
      domId: 'canvasLatEsq',
      titulo: 'Vista Lateral Esquerda',
      legenda:
        'Marque calçados nos membros esquerdos, rodopios de pescoço, marcas a fogo na anca',
      clearLabel: 'Limpar',
      ref: canvasRefs.latEsq,
      bg: bgConfigs.latEsq,
      bgAlt: 'Silhueta Lateral Esquerda',
      width: 500,
      height: 500,
      maxWidthClass: 'max-w-[420px]',
      aspectClass: 'aspect-square',
      onClear: () => handleLimparCanvas(canvasRefs.latEsq, 'Vista Lateral Esquerda'),
    },
    {
      domId: 'canvasLatDir',
      titulo: 'Vista Lateral Direita',
      legenda:
        'Marque calçados nos membros direitos, espádua, costado e garupa direita',
      clearLabel: 'Limpar',
      ref: canvasRefs.latDir,
      bg: bgConfigs.latDir,
      bgAlt: 'Silhueta Lateral Direita',
      width: 500,
      height: 500,
      maxWidthClass: 'max-w-[420px]',
      aspectClass: 'aspect-square',
      onClear: () => handleLimparCanvas(canvasRefs.latDir, 'Vista Lateral Direita'),
    },
    {
      domId: 'canvasFrontal',
      titulo: 'Vista Frontal (Cabeça)',
      legenda: 'Desenhe estrelas/luzeiros com o lápis branco na fronte e marque rodopios inter-oculares e topete',
      clearLabel: 'Limpar',
      ref: canvasRefs.frontal,
      bg: bgConfigs.frontal,
      bgAlt: 'Silhueta Frontal Cabeça',
      width: 139,
      height: 450,
      maxWidthClass: 'max-w-[200px]',
      aspectClass: 'aspect-[497/1614]',
      onClear: () => handleLimparCanvas(canvasRefs.frontal, 'Vista Frontal'),
    },
    {
      domId: 'canvasChanfro',
      titulo: 'Detalhe do Chanfro & Focinho',
      legenda: 'Marque filetes, cordões, betas e manchas brancas no focinho e lábios',
      clearLabel: 'Limpar',
      ref: canvasRefs.chanfro,
      bg: bgConfigs.chanfro,
      bgAlt: 'Silhueta Chanfro e Focinho',
      width: 450,
      height: 343,
      maxWidthClass: 'max-w-[320px]',
      aspectClass: 'aspect-[497/379]',
      onClear: () => handleLimparCanvas(canvasRefs.chanfro, 'Vista Chanfro/Focinho'),
    },
  ];

  const vistaPeito: CanvasViewConfig = {
    domId: 'canvasPeito',
    titulo: 'Peito / Pescoço / Queixo',
    legenda: 'Marque rodopios de garganta (leque/gargantilhado), espada romana na tábua do pescoço e marcas no antepeito',
    clearLabel: 'Limpar',
    ref: canvasRefs.peito,
    bg: bgConfigs.peito,
    bgAlt: 'Silhueta de Peito, Pescoço e Queixo',
    width: 114,
    height: 450,
    maxWidthClass: 'max-w-[180px]',
    aspectClass: 'aspect-[495/1949]',
    onClear: () => handleLimparCanvas(canvasRefs.peito, 'Vista Peito/Pescoço'),
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* BARRA DE FERRAMENTAS ZOOTÉCNICAS */}
      <Toolbar
        ferramenta={ferramenta}
        cor={cor}
        espessura={espessura}
        ultimaMarca={ultimaMarca}
        onSelectLapis={(novaCor) => {
          setFerramenta('lapis');
          setCor(novaCor);
        }}
        onSelectBorracha={() => setFerramenta('borracha')}
        onSelectCarimbo={(tool) => setFerramenta(tool)}
        onEspessuraChange={setEspessura}
      />

      {/* GRADE DAS VISTAS ANATÔMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vistasPrincipais.map((vista) => (
          <CanvasView key={vista.domId} config={vista} />
        ))}
      </div>

      {/* VISTA ADICIONAL: PEITO / PESCOÇO / QUEIXO */}
      <div className="flex justify-center">
        <div className="w-full max-w-[220px]">
          <CanvasView config={vistaPeito} />
        </div>
      </div>

      {/* PAINEL DE MARCAS ZOOTÉCNICAS IDENTIFICADAS */}
      <MarksPanel
        historicoMarcas={historicoMarcas}
        onClearAll={() => setHistoricoMarcas([])}
        onRemove={handleRemoverMarca}
      />

      {/* BOTÕES DE NAVEGAÇÃO */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          id="btn-voltar-etapa1"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#5C3D2E] text-white hover:bg-[#6D4937] border border-[#8B5A2B] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Dados</span>
        </button>

        <button
          type="button"
          id="btn-avancar-etapa3"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-[#1B5E20] text-white hover:bg-[#2E7D32] border border-[#8B5A2B] shadow-md hover:shadow-lg transition-all transform active:scale-98"
        >
          <Wand2 className="w-5 h-5 text-[#A5D6A7]" />
          <span>Gerar Esboço da Resenha & PDF</span>
        </button>
      </div>
    </div>
  );
};
