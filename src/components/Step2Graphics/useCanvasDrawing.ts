import { useRef, useState, useCallback, useEffect, RefObject, Dispatch, SetStateAction } from 'react';
import { ToolType, CanvasId } from '../../types';
import { gerarTextoMarca } from '../../utils/anatomicalEngine';

export interface CanvasRefsMap {
  latEsq: RefObject<HTMLCanvasElement | null>;
  latDir: RefObject<HTMLCanvasElement | null>;
  frontal: RefObject<HTMLCanvasElement | null>;
  chanfro: RefObject<HTMLCanvasElement | null>;
}

interface InitialDesenhosMap {
  latEsq: string | null;
  latDir: string | null;
  frontal: string | null;
  chanfro: string | null;
}

interface UseCanvasDrawingParams {
  canvasRefs: CanvasRefsMap;
  ferramenta: ToolType;
  cor: string;
  espessura: number;
  historicoMarcas: string[];
  setHistoricoMarcas: Dispatch<SetStateAction<string[]>>;
  initialDesenhos?: InitialDesenhosMap;
}

export function useCanvasDrawing({
  canvasRefs,
  ferramenta,
  cor,
  espessura,
  historicoMarcas,
  setHistoricoMarcas,
  initialDesenhos,
}: UseCanvasDrawingParams) {
  const isDrawing = useRef(false);
  const [ultimaMarca, setUltimaMarca] = useState<string | null>(null);

  const setupCanvasInteraction = useCallback(
    (canvasId: CanvasId, ref: RefObject<HTMLCanvasElement | null>) => {
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

  // Restaura o desenho salvo (se houver) ao montar os canvases — cobre o caso de
  // voltar da Etapa 3 para a Etapa 2, quando os canvases são recriados em branco
  useEffect(() => {
    const restaurar = (
      ref: RefObject<HTMLCanvasElement | null>,
      dataUrl: string | null | undefined
    ) => {
      const canvas = ref.current;
      if (!canvas || !dataUrl) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = dataUrl;
    };

    restaurar(canvasRefs.latEsq, initialDesenhos?.latEsq);
    restaurar(canvasRefs.latDir, initialDesenhos?.latDir);
    restaurar(canvasRefs.frontal, initialDesenhos?.frontal);
    restaurar(canvasRefs.chanfro, initialDesenhos?.chanfro);
    // Executa apenas na montagem: é uma restauração única, não deve repetir a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ultimaMarca };
}
