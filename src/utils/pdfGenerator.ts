import { jsPDF } from 'jspdf';
import { ResenhaData, SilhuetaBgConfig } from '../types';

interface GeneratePdfParams {
  data: ResenhaData;
  desenhos: {
    latEsq: string | null;
    latDir: string | null;
    frontal: string | null;
    chanfro: string | null;
    peito: string | null;
  };
  bgImages: {
    latEsq: SilhuetaBgConfig;
    latDir: SilhuetaBgConfig;
    frontal: SilhuetaBgConfig;
    chanfro: SilhuetaBgConfig;
    peito: SilhuetaBgConfig;
  };
}

/**
 * Calcula o retângulo (letterbox) que encaixa uma imagem de origem dentro de um
 * destino preservando a proporção — equivalente a `object-fit: contain`.
 */
function computeContainRect(srcW: number, srcH: number, destW: number, destH: number) {
  const scale = Math.min(destW / srcW, destH / srcH);
  const w = srcW * scale;
  const h = srcH * scale;
  return { x: (destW - w) / 2, y: (destH - h) / 2, w, h };
}

/**
 * Combina a silhueta de fundo (recortada, se aplicável) com o desenho do usuário
 * (capturado como PNG antes do canvas ser desmontado na troca de etapa) em um
 * único Canvas temporário, preservando a proporção original da imagem de fundo
 */
async function combinarCanvasComFundo(
  desenhoDataUrl: string | null,
  bg: SilhuetaBgConfig,
  largura: number,
  altura: number
): Promise<string> {
  const offscreen = document.createElement('canvas');
  offscreen.width = largura;
  offscreen.height = altura;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return '';

  // Fundo branco base
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, largura, altura);

  // Carrega a silhueta de fundo (recortando a sub-região quando configurado)
  await new Promise<void>((resolve) => {
    const imgBg = new Image();
    imgBg.crossOrigin = 'anonymous';
    imgBg.onload = () => {
      if (bg.crop) {
        const rect = computeContainRect(bg.crop.naturalWidth, bg.crop.height, largura, altura);
        ctx.drawImage(
          imgBg,
          0, bg.crop.top, bg.crop.naturalWidth, bg.crop.height,
          rect.x, rect.y, rect.w, rect.h
        );
      } else {
        const rect = computeContainRect(imgBg.naturalWidth, imgBg.naturalHeight, largura, altura);
        ctx.drawImage(imgBg, rect.x, rect.y, rect.w, rect.h);
      }
      resolve();
    };
    imgBg.onerror = () => resolve();
    imgBg.src = bg.src;
  });

  // Sobrepõe os traços do usuário (mesma resolução do canvas original, sem recorte)
  if (desenhoDataUrl) {
    await new Promise<void>((resolve) => {
      const imgDesenho = new Image();
      imgDesenho.onload = () => {
        ctx.drawImage(imgDesenho, 0, 0, largura, altura);
        resolve();
      };
      imgDesenho.onerror = () => resolve();
      imgDesenho.src = desenhoDataUrl;
    });
  }

  return offscreen.toDataURL('image/png', 0.95);
}

export async function gerarPdfResenha(params: GeneratePdfParams): Promise<void> {
  const { data, desenhos, bgImages } = params;
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de cores rurais brasileiras para o PDF
  const verdeEscuro: [number, number, number] = [27, 94, 32]; // #1B5E20
  const verdeMusgo: [number, number, number] = [46, 125, 50]; // #2E7D32
  const marromCouro: [number, number, number] = [92, 61, 46]; // #5C3D2E
  const marromTerra: [number, number, number] = [139, 90, 43]; // #8B5A2B
  const cremeFundo: [number, number, number] = [250, 246, 240];
  const cinzaTexto: [number, number, number] = [60, 60, 60];

  // 1. CABEÇALHO INSTITUCIONAL RURAL
  pdf.setFillColor(...verdeEscuro);
  pdf.rect(0, 0, pageWidth, 24, 'F');

  // Faixa de destaque dourada/marrom
  pdf.setFillColor(...marromTerra);
  pdf.rect(0, 24, pageWidth, 2.5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('AMORIMPEC • ZOOTECNIA & RESENHA EQUINA', pageWidth / 2, 11, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(220, 245, 220);
  pdf.text('FICHA OFICIAL DE IDENTIFICAÇÃO E RESENHA GRÁFICA DE EQUÍDEOS', pageWidth / 2, 17, { align: 'center' });

  // Informações de data / protocolo
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const protocolo = `PRT-${Date.now().toString().slice(-6)}`;
  pdf.setFontSize(7.5);
  pdf.setTextColor(180, 180, 180);
  pdf.text(`Emissão: ${dataHoje} | Reg: ${protocolo}`, pageWidth - margin, 31, { align: 'right' });

  // 2. QUADRO DE DADOS GERAIS (PROPRIETÁRIO, RESENHADOR, ANIMAL)
  let y = 34;

  // Caixa de Informações
  pdf.setFillColor(...cremeFundo);
  pdf.setDrawColor(...marromCouro);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  // Título da Seção
  pdf.setFillColor(...marromCouro);
  pdf.rect(margin, y, contentWidth, 5.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('1. DADOS DE IDENTIFICAÇÃO E CADASTRO ZOOTÉCNICO', margin + 3, y + 4);

  // Coluna 1: Proprietário & Resenhador
  pdf.setFontSize(7.5);
  pdf.setTextColor(...cinzaTexto);
  let curY = y + 9.5;

  pdf.setFont('helvetica', 'bold');
  pdf.text('Proprietário:', margin + 3, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.propNome || '-', margin + 24, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Telefone:', margin + 110, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.propTel || '-', margin + 125, curY);

  curY += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Município / UF:', margin + 3, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${data.propMunicipio || '-'} - ${data.propUF || '-'}`, margin + 27, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Fazenda/Haras:', margin + 110, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.propPropriedade || 'Não informada', margin + 133, curY);

  curY += 5.5;
  pdf.setDrawColor(210, 200, 190);
  pdf.setLineWidth(0.2);
  pdf.line(margin + 2, curY - 1.5, margin + contentWidth - 2, curY - 1.5);

  // Dados do Animal e Resenhador
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resenhador:', margin + 3, curY + 2);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${data.resNome || '-'} (${data.resRegistro ? `Reg: ${data.resRegistro}` : `Tel: ${data.resTel || '-'}`})`, margin + 23, curY + 2);

  curY += 6;
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...verdeEscuro);
  pdf.text('Nome do Animal:', margin + 3, curY);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(data.animNome || '-', margin + 28, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...cinzaTexto);
  pdf.text('Espécie:', margin + 90, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.animEspecie || '-', margin + 103, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Sexo:', margin + 135, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.animSexo || '-', margin + 145, curY);

  curY += 5.5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Pelagem Oficial:', margin + 3, curY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.animCor || '-', margin + 27, curY);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Nascimento:', margin + 90, curY);
  pdf.setFont('helvetica', 'normal');
  const nascFormat = data.animNasc ? new Date(data.animNasc + 'T00:00:00').toLocaleDateString('pt-BR') : '-';
  pdf.text(nascFormat, margin + 110, curY);

  if (data.animChip) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Microchip:', margin + 135, curY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.animChip, margin + 152, curY);
  }

  // 3. SEÇÃO DE RESENHA GRÁFICA (VISTAS ANATÔMICAS)
  y = 76;
  pdf.setFillColor(...verdeMusgo);
  pdf.rect(margin, y, contentWidth, 5.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('2. RESENHA GRÁFICA VETERINÁRIA (VISTAS ANATÔMICAS)', margin + 3, y + 4);

  // Renderizar imagens das vistas combinadas
  const [imgLatEsq, imgLatDir, imgFrontal, imgChanfro, imgPeito] = await Promise.all([
    combinarCanvasComFundo(desenhos.latEsq, bgImages.latEsq, 600, 400),
    combinarCanvasComFundo(desenhos.latDir, bgImages.latDir, 600, 400),
    combinarCanvasComFundo(desenhos.frontal, bgImages.frontal, 139, 450),
    combinarCanvasComFundo(desenhos.chanfro, bgImages.chanfro, 450, 343),
    combinarCanvasComFundo(desenhos.peito, bgImages.peito, 114, 450),
  ]);

  y += 7.5;
  // Vistas Laterais (imagens quase quadradas — caixas quadradas centralizadas)
  const wLateral = 58;
  const hLateral = 58;
  const gapX = 10;
  const startXLat = margin + (contentWidth - (wLateral * 2 + gapX)) / 2;

  pdf.setDrawColor(...marromTerra);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(startXLat, y, wLateral, hLateral + 5, 1.5, 1.5, 'S');
  pdf.addImage(imgLatEsq, 'PNG', startXLat + 1, y + 1, wLateral - 2, hLateral - 2);
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...marromCouro);
  pdf.text('VISTA LATERAL ESQUERDA', startXLat + wLateral / 2, y + hLateral + 3, { align: 'center' });

  pdf.roundedRect(startXLat + wLateral + gapX, y, wLateral, hLateral + 5, 1.5, 1.5, 'S');
  pdf.addImage(imgLatDir, 'PNG', startXLat + wLateral + gapX + 1, y + 1, wLateral - 2, hLateral - 2);
  pdf.text('VISTA LATERAL DIREITA', startXLat + wLateral + gapX + wLateral / 2, y + hLateral + 3, { align: 'center' });

  // Cabeça, Chanfro e Peito/Pescoço/Queixo — mesma altura de linha do layout
  // original (64mm); a largura de cada caixa é derivada da proporção real de
  // cada imagem para não distorcer (frontal e peito são estreitas/altas,
  // chanfro é larga/baixa)
  y += hLateral + 8;
  const hCabeca = 64;
  const wFrontal = 20; // 497/1614 * hCabeca
  const wChanfro = 84; // 497/379 * hCabeca
  const wPeito = 16; // 495/1949 * hCabeca
  const rowGap = 8;
  const row2Width = wFrontal + rowGap + wChanfro + rowGap + wPeito;
  const startXRow2 = margin + (contentWidth - row2Width) / 2;

  // Frontal (Cabeça)
  let x2 = startXRow2;
  pdf.roundedRect(x2, y, wFrontal, hCabeca + 5, 1.5, 1.5, 'S');
  pdf.addImage(imgFrontal, 'PNG', x2 + 1, y + 1, wFrontal - 2, hCabeca - 2);
  pdf.text('FRONTAL', x2 + wFrontal / 2, y + hCabeca + 3, { align: 'center' });

  // Chanfro / Focinho
  x2 += wFrontal + rowGap;
  pdf.roundedRect(x2, y, wChanfro, hCabeca + 5, 1.5, 1.5, 'S');
  pdf.addImage(imgChanfro, 'PNG', x2 + 1, y + 1, wChanfro - 2, hCabeca - 2);
  pdf.text('DETALHE CHANFRO / FOCINHO', x2 + wChanfro / 2, y + hCabeca + 3, { align: 'center' });

  // Peito / Pescoço / Queixo
  x2 += wChanfro + rowGap;
  pdf.roundedRect(x2, y, wPeito, hCabeca + 5, 1.5, 1.5, 'S');
  pdf.addImage(imgPeito, 'PNG', x2 + 1, y + 1, wPeito - 2, hCabeca - 2);
  pdf.text('PEITO', x2 + wPeito / 2, y + hCabeca + 3, { align: 'center' });

  // 4. RESENHA DESCRITIVA
  y += hCabeca + 9;
  pdf.setFillColor(...marromCouro);
  pdf.rect(margin, y, contentWidth, 5.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('3. RESENHA DESCRITIVA E SINAIS PARTICULARES', margin + 3, y + 4);

  y += 6.5;
  const boxDescHeight = 32;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(...marromCouro);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, y, contentWidth, boxDescHeight, 1.5, 1.5, 'FD');

  const descFontSize = 6.5;
  pdf.setFontSize(descFontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  const textoLimpo = (data.animDescricao || 'Sem particularidades registradas.').trim();
  const splitText = pdf.splitTextToSize(textoLimpo, contentWidth - 6);
  // Nº de linhas calculado a partir da altura real da caixa (não mais um limite
  // fixo arbitrário) — com 5 vistas, é comum a lista de marcas passar de 8 linhas
  const lineHeightMm = descFontSize * 0.3528 * 1.15;
  const maxLines = Math.max(1, Math.floor((boxDescHeight - 4) / lineHeightMm));
  if (splitText.length > maxLines) {
    const visivel = splitText.slice(0, maxLines - 1);
    visivel.push(`(+${splitText.length - visivel.length} linha(s) não exibidas aqui — texto completo editável na Etapa 3)`);
    pdf.text(visivel, margin + 3, y + 4);
  } else {
    pdf.text(splitText, margin + 3, y + 4);
  }

  // 5. CAMPOS DE ASSINATURA OFICIAL
  y += boxDescHeight + 6;
  const wAssinatura = 80;
  
  // Assinatura Proprietário
  pdf.setDrawColor(...marromTerra);
  pdf.setLineWidth(0.3);
  pdf.line(margin + 5, y + 12, margin + 5 + wAssinatura, y + 12);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...cinzaTexto);
  pdf.text(data.propNome ? data.propNome.toUpperCase() : 'PROPRIETÁRIO / RESPONSÁVEL', margin + 5 + wAssinatura / 2, y + 16, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text('Assinatura do Proprietário / Detentor', margin + 5 + wAssinatura / 2, y + 19, { align: 'center' });

  // Assinatura Resenhador
  const startXRes = margin + contentWidth - wAssinatura - 5;
  pdf.line(startXRes, y + 12, startXRes + wAssinatura, y + 12);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.resNome ? data.resNome.toUpperCase() : 'MÉDICO VETERINÁRIO / RESENHADOR', startXRes + wAssinatura / 2, y + 16, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.text(data.resRegistro ? `Registro Profissional: ${data.resRegistro}` : 'Assinatura e Carimbo do Responsável Técnico', startXRes + wAssinatura / 2, y + 19, { align: 'center' });

  // Rodapé decorativo
  pdf.setFillColor(...verdeEscuro);
  pdf.rect(0, 290, pageWidth, 7, 'F');
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Amorimpec • Sistema Integrado de Resenha e Gestão Zootécnica de Equídeos • Documento Válido para Cadastro e Manejo', pageWidth / 2, 294.5, { align: 'center' });

  // Salva o PDF
  const nomeSanitizado = (data.animNome || 'Animal').replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Resenha_Equina_${nomeSanitizado}_Amorimpec.pdf`);
}
