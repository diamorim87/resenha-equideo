import { useRef, useState, useCallback, useEffect, RefObject, Dispatch, SetStateAction } from 'react';
import { ToolType, CanvasId, SilhuetaBgConfig } from '../../types';
import { gerarTextoMarca } from '../../utils/anatomicalEngine';
import { calcularMascaraSilhueta, estaDentroDaSilhueta, MascaraSilhueta } from '../../utils/silhouetteMask';

export interface CanvasRefsMap {
  latEsq: RefObject<HTMLCanvasElement | null>;
  latDir: RefObject<HTMLCanvasElement | null>;
  frontal: RefObject<HTMLCanvasElement | null>;
  chanfro: RefObject<HTMLCanvasElement | null>;
  peito: RefObject<HTMLCanvasElement | null>;
}

interface InitialDesenhosMap {
  latEsq: string | null;
  latDir: string | null;
  frontal: string | null;
  chanfro: string | null;
  peito: string | null;
}

interface BgConfigsMap {
  latEsq: SilhuetaBgConfig;
  latDir: SilhuetaBgConfig;
  frontal: SilhuetaBgConfig;
  chanfro: SilhuetaBgConfig;
  peito: SilhuetaBgConfig;
}

interface UseCanvasDrawingParams {
  canvasRefs: CanvasRefsMap;
  bgConfigs: BgConfigsMap;
  ferramenta: ToolType;
  cor: string;
  espessura: number;
  /** Ângulo (graus, 0°=direita, sentido horário) do carimbo de espiga */
  anguloEspiga: number;
  historicoMarcas: string[];
  setHistoricoMarcas: Dispatch<SetStateAction<string[]>>;
  initialDesenhos?: InitialDesenhosMap;
  onDrawingChange?: () => void;
}

export function useCanvasDrawing({
  canvasRefs,
  bgConfigs,
  ferramenta,
  cor,
  espessura,
  anguloEspiga,
  historicoMarcas,
  setHistoricoMarcas,
  initialDesenhos,
  onDrawingChange,
}: UseCanvasDrawingParams) {
  const isDrawing = useRef(false);
  const [ultimaMarca, setUltimaMarca] = useState<string | null>(null);
  // Máscaras (1 = dentro do desenho do cavalo) calculadas por flood-fill a
  // partir da imagem de fundo de cada vista — impede marcações fora da silhueta
  const mascarasRef = useRef<Partial<Record<CanvasId, MascaraSilhueta>>>({});

  // Calcula as máscaras uma única vez, ao montar (mesma lógica de fail-open:
  // enquanto a máscara de uma vista não estiver pronta, o desenho é liberado).
  // Roda na resolução natural da imagem, não na do canvas — ver silhouetteMask.ts
  useEffect(() => {
    let cancelado = false;
    const tarefas: Array<[CanvasId, SilhuetaBgConfig]> = [
      ['canvasLatEsq', bgConfigs.latEsq],
      ['canvasLatDir', bgConfigs.latDir],
      ['canvasFrontal', bgConfigs.frontal],
      ['canvasChanfro', bgConfigs.chanfro],
      ['canvasPeito', bgConfigs.peito],
    ];
    tarefas.forEach(([canvasId, bg]) => {
      calcularMascaraSilhueta(bg).then((mascara) => {
        if (!cancelado) mascarasRef.current[canvasId] = mascara;
      });
    });
    return () => {
      cancelado = true;
    };
    // Executa apenas na montagem — as imagens de fundo são fixas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupCanvasInteraction = useCallback(
    (canvasId: CanvasId, ref: RefObject<HTMLCanvasElement | null>) => {
      const canvas = ref.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Se o último ponto do traço em andamento ficou fora da silhueta, o
      // próximo ponto válido reinicia o traço (evita "pular" por cima do vazio)
      let ultimoPontoForaDaArea = false;

      const dentroDaSilhueta = (x: number, y: number) =>
        estaDentroDaSilhueta(mascarasRef.current[canvasId], canvas.width, canvas.height, x, y);

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

        // Marcações só valem dentro do desenho do cavalo
        if (!dentroDaSilhueta(pos.x, pos.y)) {
          isDrawing.current = false;
          return;
        }

        if (ferramenta.startsWith('carimbo_')) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = cor === 'white' ? '#FAF8F5' : cor;
          const stampSize = 16 + espessura * 2;
          ctx.font = `bold ${stampSize}px 'Segoe UI', Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const symbol = ferramenta === 'carimbo_x' ? 'X' : '→ E';

          // A espiga gira em torno do ponto clicado para apontar na direção
          // real observada na pelagem; o rodopio (X) é simétrico, não gira
          const rotacionar = ferramenta === 'carimbo_espiga' && anguloEspiga !== 0;
          if (rotacionar) {
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate((anguloEspiga * Math.PI) / 180);
            ctx.translate(-pos.x, -pos.y);
          }

          // Desenho com sombra sutil para contraste se for branco
          if (cor === 'white') {
            ctx.strokeStyle = '#5C3D2E';
            ctx.lineWidth = 2;
            ctx.strokeText(symbol, pos.x, pos.y);
          }

          ctx.fillText(symbol, pos.x, pos.y);

          if (rotacionar) {
            ctx.restore();
          }

          // Registra no motor zootécnico
          const texto = gerarTextoMarca(
            canvasId,
            pos.x,
            pos.y,
            canvas.width,
            canvas.height,
            ferramenta,
            cor,
            espessura,
            anguloEspiga
          );

          if (texto && !historicoMarcas.includes(texto)) {
            setHistoricoMarcas((prev) => [...prev, texto]);
            setUltimaMarca(texto);
          }
          isDrawing.current = false;
          onDrawingChange?.();
          return;
        }

        isDrawing.current = true;
        ultimoPontoForaDaArea = false;
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

        // Sai da silhueta: não desenha, mas lembra para reiniciar o traço
        // quando o ponteiro voltar para dentro (evita "pular" por cima do vazio)
        if (!dentroDaSilhueta(pos.x, pos.y)) {
          ultimoPontoForaDaArea = true;
          return;
        }

        ctx.lineWidth = espessura;
        if (ferramenta === 'borracha') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.lineWidth = espessura * 2.5;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = cor === 'white' ? '#FFFFFF' : cor;
        }

        if (ultimoPontoForaDaArea) {
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ultimoPontoForaDaArea = false;
          return;
        }

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      };

      const stopDraw = (e: MouseEvent | TouchEvent) => {
        if (isDrawing.current) {
          e.preventDefault();
          isDrawing.current = false;
          onDrawingChange?.();
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
    [ferramenta, cor, espessura, anguloEspiga, historicoMarcas, setHistoricoMarcas, onDrawingChange]
  );

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    cleanups.push(setupCanvasInteraction('canvasLatEsq', canvasRefs.latEsq));
    cleanups.push(setupCanvasInteraction('canvasLatDir', canvasRefs.latDir));
    cleanups.push(setupCanvasInteraction('canvasFrontal', canvasRefs.frontal));
    cleanups.push(setupCanvasInteraction('canvasChanfro', canvasRefs.chanfro));
    cleanups.push(setupCanvasInteraction('canvasPeito', canvasRefs.peito));

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
    restaurar(canvasRefs.peito, initialDesenhos?.peito);
    // Executa apenas na montagem: é uma restauração única, não deve repetir a cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ultimaMarca };
}
