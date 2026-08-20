import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ToolType, CanvasId } from '../types';
import {
  DICIONARIO_CORES,
  mapearZonaZootecnica,
  gerarTextoMarca,
} from '../utils/anatomicalEngine';
import {
  PenTool,
  Eraser,
  Trash2,
  ArrowLeft,
  Wand2,
  Undo2,
  Info,
  CheckCircle2,
  Tag,
  Eye,
} from 'lucide-react';

interface Step2GraphicsProps {
  canvasRefs: {
    latEsq: React.RefObject<HTMLCanvasElement | null>;
    latDir: React.RefObject<HTMLCanvasElement | null>;
    frontal: React.RefObject<HTMLCanvasElement | null>;
    chanfro: React.RefObject<HTMLCanvasElement | null>;
  };
  bgDataUrls: {
    latEsq: string;
    latDir: string;
    frontal: string;
    chanfro: string;
  };
  historicoMarcas: string[];
  setHistoricoMarcas: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Graphics: React.FC<Step2GraphicsProps> = ({
  canvasRefs,
  bgDataUrls,
  historicoMarcas,
  setHistoricoMarcas,
  onNext,
  onBack,
}) => {
  const [ferramenta, setFerramenta] = useState<ToolType>('lapis');
  const [cor, setCor] = useState<string>('black');
  const [espessura, setEspessura] = useState<number>(4);
  const [ultimaMarca, setUltimaMarca] = useState<string | null>(null);

  // Estados de desenho para cada canvas
  const isDrawing = useRef(false);

  // Inicializa cada canvas com desenho interativo
  const setupCanvasInteraction = useCallback(
    (canvasId: CanvasId, ref: React.RefObject<HTMLCanvasElement | null>) => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY,
        };
      };

      const startDraw = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e);

        if (ferramenta.startsWith('carimbo_')) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = cor === 'white' ? '#FAF8F5' : cor;
          const stampSize = 16 + espessura * 2;
          ctx.font = `bold ${stampSize}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          let symbol = 'X';
          if (ferramenta === 'carimbo_x') symbol = 'X';
          if (ferramenta === 'carimbo_edir') symbol = '→ E';
          if (ferramenta === 'carimbo_eesq') symbol = 'E ←';
          if (ferramenta === 'carimbo_estrela') symbol = '★';
          if (ferramenta === 'carimbo_fogo') symbol = '☩';

          // Desenho com sombra sutil para contraste se for branco
          if (cor === 'white') {
            ctx.strokeStyle = '#5C3D2E';
            ctx.lineWidth = 2;
            ctx.strokeText(symbol, pos.x, pos.y);
          }

          ctx.fillText(symbol, pos.x, pos.y);

          // Registra no motor zootécnico
          const texto = gerarTextoMarca(
            canvasId,
            pos.x,
            pos.y,
            canvas.width,
            canvas.height,
            ferramenta,
            cor,
            espessura
          );

          if (texto && !historicoMarcas.includes(texto)) {
            setHistoricoMarcas((prev) => [...prev, texto]);
            setUltimaMarca(texto);
          }
          isDrawing.current = false;
          return;
        }

        isDrawing.current = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

        const texto = gerarTextoMarca(
          canvasId,
          pos.x,
          pos.y,
          canvas.width,
          canvas.height,
          ferramenta,
          cor,
          espessura
        );

        if (texto && !historicoMarcas.includes(texto)) {
          setHistoricoMarcas((prev) => [...prev, texto]);
          setUltimaMarca(texto);
        }
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing.current) return;
        e.preventDefault();
        const pos = getPos(e);

        ctx.lineWidth = espessura;
        if (ferramenta === 'borracha') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.lineWidth = espessura * 2.5;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = cor === 'white' ? '#FFFFFF' : cor;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };

      const stopDraw = (e: MouseEvent | TouchEvent) => {
        if (isDrawing.current) {
          e.preventDefault();
          isDrawing.current = false;
        }
      };

      // Listeners
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDraw);
      canvas.addEventListener('mouseleave', stopDraw);

      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', stopDraw, { passive: false });
      canvas.addEventListener('touchcancel', stopDraw, { passive: false });

      return () => {
        canvas.removeEventListener('mousedown', startDraw);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDraw);
        canvas.removeEventListener('mouseleave', stopDraw);
        canvas.removeEventListener('touchstart', startDraw);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDraw);
        canvas.removeEventListener('touchcancel', stopDraw);
      };
    },
    [ferramenta, cor, espessura, historicoMarcas, setHistoricoMarcas]
  );

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    cleanups.push(setupCanvasInteraction('canvasLatEsq', canvasRefs.latEsq));
    cleanups.push(setupCanvasInteraction('canvasLatDir', canvasRefs.latDir));
    cleanups.push(setupCanvasInteraction('canvasFrontal', canvasRefs.frontal));
    cleanups.push(setupCanvasInteraction('canvasChanfro', canvasRefs.chanfro));

    return () => {
      cleanups.forEach((c) => c && c());
    };
  }, [setupCanvasInteraction, canvasRefs]);

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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* BARRA DE FERRAMENTAS ZOOTÉCNICAS */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border-2 border-[#8B5A2B]/40 sticky top-20 z-30">
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
              onClick={() => {
                setFerramenta('lapis');
                setCor('black');
              }}
              title="Marcação Escura / Calçado Preto"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
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
              onClick={() => {
                setFerramenta('lapis');
                setCor('red');
              }}
              title="Cicatriz / Ferida / Marca a Fogo"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
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
              onClick={() => {
                setFerramenta('lapis');
                setCor('saddlebrown');
              }}
              title="Mancha Castanha / Alazã"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
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
              onClick={() => {
                setFerramenta('lapis');
                setCor('white');
              }}
              title="Mancha Branca / Calçado / Luzeiro Despigmentado"
              className={`w-9 h-9 rounded-full flex items-center justify-center text-[#5C3D2E] border-2 border-[#D4A373] transition-all shadow-sm ${
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
              onClick={() => setFerramenta('borracha')}
              title="Borracha (Apagar Traços)"
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
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
              onClick={() => setFerramenta('carimbo_x')}
              title="Rodopio de Pelos"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                ferramenta === 'carimbo_x'
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-105'
                  : 'bg-[#FAF8F5] text-[#1B5E20] border-[#C8E6C9] hover:bg-[#E8F5E9]'
              }`}
            >
              <span className="font-mono text-sm">X</span> (Rodopio)
            </button>

            <button
              type="button"
              id="tool-carimbo-edir"
              onClick={() => setFerramenta('carimbo_edir')}
              title="Espiga virada à Direita"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                ferramenta === 'carimbo_edir'
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-105'
                  : 'bg-[#FAF8F5] text-[#1B5E20] border-[#C8E6C9] hover:bg-[#E8F5E9]'
              }`}
            >
              → E (Espiga Dir)
            </button>

            <button
              type="button"
              id="tool-carimbo-eesq"
              onClick={() => setFerramenta('carimbo_eesq')}
              title="Espiga virada à Esquerda"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                ferramenta === 'carimbo_eesq'
                  ? 'bg-[#1B5E20] text-white border-[#1B5E20] shadow-md scale-105'
                  : 'bg-[#FAF8F5] text-[#1B5E20] border-[#C8E6C9] hover:bg-[#E8F5E9]'
              }`}
            >
              E ← (Espiga Esq)
            </button>

            <button
              type="button"
              id="tool-carimbo-estrela"
              onClick={() => setFerramenta('carimbo_estrela')}
              title="Estrela / Luzeiro na Testa"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                ferramenta === 'carimbo_estrela'
                  ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] shadow-md scale-105'
                  : 'bg-[#FAF8F5] text-[#8B5A2B] border-[#D4A373] hover:bg-[#F5EBE6]'
              }`}
            >
              ★ (Estrela)
            </button>

            <button
              type="button"
              id="tool-carimbo-fogo"
              onClick={() => setFerramenta('carimbo_fogo')}
              title="Marca a Fogo / Ferro"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                ferramenta === 'carimbo_fogo'
                  ? 'bg-[#5C3D2E] text-white border-[#5C3D2E] shadow-md scale-105'
                  : 'bg-[#FAF8F5] text-[#5C3D2E] border-[#D4A373] hover:bg-[#F5EBE6]'
              }`}
            >
              ☩ (Ferro)
            </button>
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
              onChange={(e) => setEspessura(Number(e.target.value))}
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

      {/* GRADE DAS 4 VISTAS ANATÔMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Vista Lateral Esquerda */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EDE6DB] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold font-serif text-[#1B5E20] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#8B5A2B]" />
              Vista Lateral Esquerda
            </span>
            <button
              type="button"
              onClick={() => handleLimparCanvas(canvasRefs.latEsq, 'Vista Lateral Esquerda')}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>

          <div className="relative w-full max-w-[420px] aspect-[3/2] rounded-xl overflow-hidden border-2 border-[#D4A373] bg-[#FAF8F5] shadow-inner">
            {/* Silhueta de fundo */}
            <img
              src={bgDataUrls.latEsq}
              alt="Silhueta Lateral Esquerda"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
            {/* Canvas Interativo */}
            <canvas
              ref={canvasRefs.latEsq}
              id="canvasLatEsq"
              width={600}
              height={400}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
          <p className="text-[11px] text-[#8B5A2B] mt-2 text-center">
            Marque calçados nos membros esquerdos, rodopios de pescoço, marcas a fogo na anca
          </p>
        </div>

        {/* 2. Vista Lateral Direita */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EDE6DB] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold font-serif text-[#1B5E20] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#8B5A2B]" />
              Vista Lateral Direita
            </span>
            <button
              type="button"
              onClick={() => handleLimparCanvas(canvasRefs.latDir, 'Vista Lateral Direita')}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>

          <div className="relative w-full max-w-[420px] aspect-[3/2] rounded-xl overflow-hidden border-2 border-[#D4A373] bg-[#FAF8F5] shadow-inner">
            <img
              src={bgDataUrls.latDir}
              alt="Silhueta Lateral Direita"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
            <canvas
              ref={canvasRefs.latDir}
              id="canvasLatDir"
              width={600}
              height={400}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
          <p className="text-[11px] text-[#8B5A2B] mt-2 text-center">
            Marque calçados nos membros direitos, espádua, costado e garupa direita
          </p>
        </div>

        {/* 3. Vista Frontal (Cabeça) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EDE6DB] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold font-serif text-[#1B5E20] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#8B5A2B]" />
              Vista Frontal (Cabeça)
            </span>
            <button
              type="button"
              onClick={() => handleLimparCanvas(canvasRefs.frontal, 'Vista Frontal')}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>

          <div className="relative w-full max-w-[280px] aspect-[11/15] rounded-xl overflow-hidden border-2 border-[#D4A373] bg-[#FAF8F5] shadow-inner">
            <img
              src={bgDataUrls.frontal}
              alt="Silhueta Frontal Cabeça"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
            <canvas
              ref={canvasRefs.frontal}
              id="canvasFrontal"
              width={440}
              height={600}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
          <p className="text-[11px] text-[#8B5A2B] mt-2 text-center">
            Marque estrelas na fronte, rodopios inter-oculares e topete
          </p>
        </div>

        {/* 4. Vista do Chanfro e Focinho */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#EDE6DB] flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-sm font-bold font-serif text-[#1B5E20] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#8B5A2B]" />
              Detalhe do Chanfro & Focinho
            </span>
            <button
              type="button"
              onClick={() => handleLimparCanvas(canvasRefs.chanfro, 'Vista Chanfro/Focinho')}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>

          <div className="relative w-full max-w-[280px] aspect-[11/15] rounded-xl overflow-hidden border-2 border-[#D4A373] bg-[#FAF8F5] shadow-inner">
            <img
              src={bgDataUrls.chanfro}
              alt="Silhueta Chanfro e Focinho"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />
            <canvas
              ref={canvasRefs.chanfro}
              id="canvasChanfro"
              width={440}
              height={600}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
          </div>
          <p className="text-[11px] text-[#8B5A2B] mt-2 text-center">
            Marque filetes, cordões, betas e manchas brancas no focinho e lábios
          </p>
        </div>
      </div>

      {/* PAINEL DE MARCAS ZOOTÉCNICAS IDENTIFICADAS */}
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
              onClick={() => setHistoricoMarcas([])}
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
                  onClick={() => handleRemoverMarca(idx)}
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
