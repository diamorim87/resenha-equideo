/**
 * Silhuetas Zootécnicas Oficiais Vetoriais de Alta Resolução para Ficha de Resenha Equina
 */

export const SVG_LATERAL_ESQUERDA = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <style>
      .outline { fill: #fdfbf7; stroke: #5c3d2e; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .detail { fill: none; stroke: #8b5a2b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4,4; opacity: 0.6; }
      .anatomical { fill: none; stroke: #b87333; stroke-width: 1.5; opacity: 0.4; }
      .label-text { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #8b5a2b; font-weight: bold; opacity: 0.5; }
    </style>
  </defs>
  <!-- Fundo sutil -->
  <rect width="600" height="400" fill="#faf6f0" rx="12" />
  
  <!-- Linha de Chão / Prumo -->
  <line x1="40" y1="365" x2="560" y2="365" stroke="#d5c7b5" stroke-width="2" stroke-dasharray="6,6" />

  <!-- Corpo do Equino - Vista Lateral Esquerda (Cabeça à esquerda) -->
  <g id="cavalo-lat-esq">
    <!-- Membro Anterior Direito (Fundo) -->
    <path d="M 215 170 L 225 240 L 225 290 L 225 330 L 215 355 L 235 355 L 240 330 L 238 290 L 242 240 L 235 170" fill="#e8dfd5" stroke="#7a5538" stroke-width="2.5" />
    
    <!-- Membro Posterior Direito (Fundo) -->
    <path d="M 420 180 L 435 240 L 415 285 L 420 330 L 410 355 L 430 355 L 435 330 L 430 285 L 450 240 L 440 180" fill="#e8dfd5" stroke="#7a5538" stroke-width="2.5" />

    <!-- Corpo Principal e Membros em Primeiro Plano -->
    <!-- Contorno do Cavalo: Focinho -> Cabeça -> Orelha -> Nuca -> Dorso -> Garupa -> Cauda -> Perna Post Esq -> Ventre -> Perna Ant Esq -> Peito -> Garganta -> Queixo -->
    <path class="outline" d="
      M 75 145
      C 65 140, 60 130, 65 120
      C 70 110, 85 105, 105 100
      L 125 70
      C 130 65, 135 65, 137 72
      L 142 95
      C 160 105, 185 115, 210 120
      C 225 118, 240 122, 260 128
      C 290 132, 330 132, 360 128
      C 390 125, 420 125, 455 135
      C 475 145, 490 165, 490 185
      C 495 210, 485 240, 470 270
      L 460 280
      L 460 325
      L 452 355
      L 475 355
      L 480 325
      L 485 270
      C 495 240, 500 200, 485 170
      C 505 180, 515 220, 510 270
      C 505 310, 495 330, 495 330
      L 490 330
      C 490 280, 485 210, 475 185
      C 460 165, 440 160, 425 165
      C 380 185, 330 190, 280 185
      C 260 185, 245 180, 235 175
      L 205 245
      L 202 290
      L 198 328
      L 190 355
      L 212 355
      L 218 328
      L 215 290
      L 220 245
      C 225 215, 230 190, 220 170
      C 200 170, 180 165, 165 155
      C 150 145, 140 135, 130 130
      L 115 138
      C 95 148, 85 150, 75 145
      Z
    " />

    <!-- Orelha Esquerda Interna / Detalhe -->
    <path d="M 127 75 Q 134 85 137 98" class="detail" />
    
    <!-- Olho e Narina Esquerda -->
    <circle cx="108" cy="108" r="4.5" fill="#5c3d2e" />
    <path d="M 75 125 C 72 127, 72 133, 76 135" fill="none" stroke="#5c3d2e" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Linha da Boca -->
    <path d="M 66 136 C 72 139, 80 138, 85 137" fill="none" stroke="#5c3d2e" stroke-width="2" stroke-linecap="round" />

    <!-- Linha da Espádua / Ombro -->
    <path d="M 215 125 C 200 145, 195 170, 205 190" class="detail" />
    
    <!-- Costado / Costelas Sutis -->
    <path d="M 280 140 C 275 160, 275 175, 285 180" class="anatomical" />
    <path d="M 310 140 C 305 160, 305 175, 315 180" class="anatomical" />
    <path d="M 340 140 C 335 160, 335 175, 345 180" class="anatomical" />

    <!-- Detalhes de Cascos -->
    <line x1="190" y1="345" x2="212" y2="345" stroke="#5c3d2e" stroke-width="2" />
    <line x1="452" y1="345" x2="475" y2="345" stroke="#5c3d2e" stroke-width="2" />
  </g>

  <!-- Rótulo / Legenda -->
  <text x="30" y="35" class="label-text">LATERAL ESQUERDA</text>
  <text x="30" y="380" font-family="'Segoe UI', Arial" font-size="10" fill="#a8927a">Cabeça / Espádua / Costado / Garupa / Membros Esquerdos</text>
</svg>
`;

export const SVG_LATERAL_DIREITA = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <style>
      .outline { fill: #fdfbf7; stroke: #5c3d2e; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .detail { fill: none; stroke: #8b5a2b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4,4; opacity: 0.6; }
      .anatomical { fill: none; stroke: #b87333; stroke-width: 1.5; opacity: 0.4; }
      .label-text { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #8b5a2b; font-weight: bold; opacity: 0.5; }
    </style>
  </defs>
  <!-- Fundo sutil -->
  <rect width="600" height="400" fill="#faf6f0" rx="12" />
  
  <!-- Linha de Chão / Prumo -->
  <line x1="40" y1="365" x2="560" y2="365" stroke="#d5c7b5" stroke-width="2" stroke-dasharray="6,6" />

  <!-- Corpo do Equino - Vista Lateral Direita (Cabeça à direita, espelhado) -->
  <g id="cavalo-lat-dir" transform="translate(600, 0) scale(-1, 1)">
    <!-- Membro Anterior Esquerdo (Fundo) -->
    <path d="M 215 170 L 225 240 L 225 290 L 225 330 L 215 355 L 235 355 L 240 330 L 238 290 L 242 240 L 235 170" fill="#e8dfd5" stroke="#7a5538" stroke-width="2.5" />
    
    <!-- Membro Posterior Esquerdo (Fundo) -->
    <path d="M 420 180 L 435 240 L 415 285 L 420 330 L 410 355 L 430 355 L 435 330 L 430 285 L 450 240 L 440 180" fill="#e8dfd5" stroke="#7a5538" stroke-width="2.5" />

    <!-- Corpo Principal e Membros em Primeiro Plano -->
    <path class="outline" d="
      M 75 145
      C 65 140, 60 130, 65 120
      C 70 110, 85 105, 105 100
      L 125 70
      C 130 65, 135 65, 137 72
      L 142 95
      C 160 105, 185 115, 210 120
      C 225 118, 240 122, 260 128
      C 290 132, 330 132, 360 128
      C 390 125, 420 125, 455 135
      C 475 145, 490 165, 490 185
      C 495 210, 485 240, 470 270
      L 460 280
      L 460 325
      L 452 355
      L 475 355
      L 480 325
      L 485 270
      C 495 240, 500 200, 485 170
      C 505 180, 515 220, 510 270
      C 505 310, 495 330, 495 330
      L 490 330
      C 490 280, 485 210, 475 185
      C 460 165, 440 160, 425 165
      C 380 185, 330 190, 280 185
      C 260 185, 245 180, 235 175
      L 205 245
      L 202 290
      L 198 328
      L 190 355
      L 212 355
      L 218 328
      L 215 290
      L 220 245
      C 225 215, 230 190, 220 170
      C 200 170, 180 165, 165 155
      C 150 145, 140 135, 130 130
      L 115 138
      C 95 148, 85 150, 75 145
      Z
    " />

    <!-- Orelha Direita Interna / Detalhe -->
    <path d="M 127 75 Q 134 85 137 98" class="detail" />
    
    <!-- Olho e Narina Direita -->
    <circle cx="108" cy="108" r="4.5" fill="#5c3d2e" />
    <path d="M 75 125 C 72 127, 72 133, 76 135" fill="none" stroke="#5c3d2e" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Linha da Boca -->
    <path d="M 66 136 C 72 139, 80 138, 85 137" fill="none" stroke="#5c3d2e" stroke-width="2" stroke-linecap="round" />

    <!-- Linha da Espádua / Ombro -->
    <path d="M 215 125 C 200 145, 195 170, 205 190" class="detail" />
    
    <!-- Costado / Costelas Sutis -->
    <path d="M 280 140 C 275 160, 275 175, 285 180" class="anatomical" />
    <path d="M 310 140 C 305 160, 305 175, 315 180" class="anatomical" />
    <path d="M 340 140 C 335 160, 335 175, 345 180" class="anatomical" />

    <!-- Detalhes de Cascos -->
    <line x1="190" y1="345" x2="212" y2="345" stroke="#5c3d2e" stroke-width="2" />
    <line x1="452" y1="345" x2="475" y2="345" stroke="#5c3d2e" stroke-width="2" />
  </g>

  <!-- Rótulo / Legenda -->
  <text x="30" y="35" class="label-text">LATERAL DIREITA</text>
  <text x="30" y="380" font-family="'Segoe UI', Arial" font-size="10" fill="#a8927a">Cabeça / Espádua / Costado / Garupa / Membros Direitos</text>
</svg>
`;

export const SVG_FRONTAL = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 600" width="440" height="600">
  <defs>
    <style>
      .outline { fill: #fdfbf7; stroke: #5c3d2e; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .detail { fill: none; stroke: #8b5a2b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4,4; opacity: 0.6; }
      .anatomical { fill: none; stroke: #b87333; stroke-width: 1.5; opacity: 0.4; }
      .label-text { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; fill: #8b5a2b; font-weight: bold; opacity: 0.5; }
    </style>
  </defs>
  <rect width="440" height="600" fill="#faf6f0" rx="12" />

  <!-- Eixo Central Simétrico Sutil -->
  <line x1="220" y1="50" x2="220" y2="550" stroke="#d5c7b5" stroke-width="1.5" stroke-dasharray="5,5" />

  <!-- Cabeça Vista Frontal: Orelhas, Fronte, Olhos, Ganachas, Chanfro, Focinho -->
  <g id="cabeca-frontal">
    <!-- Contorno Cabeça Completa -->
    <path class="outline" d="
      M 220 70
      C 200 68, 180 75, 160 90
      L 130 35
      C 120 40, 115 50, 125 70
      L 145 120
      C 115 160, 100 210, 100 260
      C 100 310, 120 360, 150 400
      L 165 470
      C 170 510, 185 535, 220 535
      C 255 535, 270 510, 275 470
      L 290 400
      C 320 360, 340 310, 340 260
      C 340 210, 325 160, 295 120
      L 315 70
      C 325 50, 320 40, 310 35
      L 280 90
      C 260 75, 240 68, 220 70
      Z
    " />

    <!-- Orelhas Internas -->
    <path d="M 133 55 Q 140 85 150 110" class="detail" />
    <path d="M 307 55 Q 300 85 290 110" class="detail" />

    <!-- Linha da Nuca / Topete -->
    <path d="M 180 85 Q 220 95 260 85" class="anatomical" />

    <!-- Fronte / Testa (Região de Estrela e Rodopio) -->
    <ellipse cx="220" cy="170" rx="45" ry="30" class="anatomical" stroke-dasharray="3,3" />

    <!-- Olhos (Esquerdo e Direito) -->
    <ellipse cx="140" cy="240" rx="14" ry="9" fill="#5c3d2e" />
    <ellipse cx="300" cy="240" rx="14" ry="9" fill="#5c3d2e" />
    <path d="M 125 240 Q 140 228 155 240" stroke="#5c3d2e" stroke-width="2" fill="none" />
    <path d="M 285 240 Q 300 228 315 240" stroke="#5c3d2e" stroke-width="2" fill="none" />

    <!-- Linhas do Chanfro -->
    <line x1="175" y1="280" x2="175" y2="440" class="detail" />
    <line x1="265" y1="280" x2="265" y2="440" class="detail" />

    <!-- Focinho e Narinas -->
    <path d="M 185 490 C 180 475, 195 475, 195 490 C 195 500, 185 500, 185 490 Z" fill="#5c3d2e" />
    <path d="M 255 490 C 260 475, 245 475, 245 490 C 245 500, 255 500, 255 490 Z" fill="#5c3d2e" />

    <!-- Lábio e Boca -->
    <path d="M 195 515 Q 220 522 245 515" stroke="#5c3d2e" stroke-width="2.5" fill="none" stroke-linecap="round" />
  </g>

  <text x="25" y="40" class="label-text">VISTA FRONTAL (CABEÇA)</text>
  <text x="220" y="575" text-anchor="middle" font-family="'Segoe UI', Arial" font-size="11" fill="#a8927a">Topete • Fronte • Olhos • Chanfro • Focinho</text>
</svg>
`;

export const SVG_CHANFRO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 600" width="440" height="600">
  <defs>
    <style>
      .outline { fill: #fdfbf7; stroke: #5c3d2e; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }
      .detail { fill: none; stroke: #8b5a2b; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 4,4; opacity: 0.6; }
      .anatomical { fill: none; stroke: #b87333; stroke-width: 1.5; opacity: 0.4; }
      .label-text { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; fill: #8b5a2b; font-weight: bold; opacity: 0.5; }
    </style>
  </defs>
  <rect width="440" height="600" fill="#faf6f0" rx="12" />

  <line x1="220" y1="50" x2="220" y2="550" stroke="#d5c7b5" stroke-width="1.5" stroke-dasharray="5,5" />

  <!-- Zoom Anatômico em Chanfro e Focinho (Muzzle) -->
  <g id="chanfro-focinho-zoom">
    <!-- Parte Superior: Base dos Olhos e Chanfro Superior -->
    <path class="outline" d="
      M 130 90
      C 170 85, 270 85, 310 90
      C 325 140, 310 200, 295 280
      C 285 340, 280 400, 290 450
      C 295 490, 275 530, 220 530
      C 165 530, 145 490, 150 450
      C 160 400, 155 340, 145 280
      C 130 200, 115 140, 130 90
      Z
    " />

    <!-- Olhos Parciais como Referência Superior -->
    <path d="M 115 100 Q 130 85 145 100" stroke="#8b5a2b" stroke-width="2.5" fill="none" opacity="0.6" />
    <path d="M 295 100 Q 310 85 325 100" stroke="#8b5a2b" stroke-width="2.5" fill="none" opacity="0.6" />

    <!-- Guias Zootécnicas de Faixas: Estrela / Filete / Cordão / Beta / Beber em Branco -->
    <line x1="170" y1="120" x2="170" y2="380" class="detail" />
    <line x1="270" y1="120" x2="270" y2="380" class="detail" />
    
    <line x1="160" y1="200" x2="280" y2="200" class="anatomical" />
    <line x1="160" y1="300" x2="280" y2="300" class="anatomical" />
    <line x1="160" y1="400" x2="280" y2="400" class="anatomical" />

    <!-- Narinas Amplas Detalhadas -->
    <g transform="translate(0, 30)">
      <path d="M 175 400 C 160 380, 185 375, 195 395 C 200 415, 180 420, 175 400 Z" fill="#5c3d2e" stroke="#3d2314" stroke-width="2" />
      <path d="M 265 400 C 280 380, 255 375, 245 395 C 240 415, 260 420, 265 400 Z" fill="#5c3d2e" stroke="#3d2314" stroke-width="2" />

      <!-- Sulco do Filtro Nasal -->
      <line x1="220" y1="420" x2="220" y2="460" stroke="#8b5a2b" stroke-width="2" stroke-linecap="round" />

      <!-- Lábio Superior e Inferior com Curvatura Realista -->
      <path d="M 180 460 Q 220 472 260 460" stroke="#5c3d2e" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 195 482 Q 220 488 245 482" stroke="#8b5a2b" stroke-width="2" fill="none" stroke-linecap="round" />
    </g>
  </g>

  <text x="25" y="40" class="label-text">DETALHE DE CHANFRO E FOCINHO</text>
  <text x="220" y="575" text-anchor="middle" font-family="'Segoe UI', Arial" font-size="11" fill="#a8927a">Filete • Cordão • Beta • Beber em Branco • Narinas</text>
</svg>
`;

/**
 * Converte string SVG para Data URL utilizável em Canvas e jsPDF
 */
export function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
