export interface PelagemGroup {
  grupo: string;
  opcoes: { valor: string; nome: string; descricao?: string }[];
}

export const GRUPOS_PELAGENS: PelagemGroup[] = [
  {
    grupo: 'Cremelo e Branco',
    opcoes: [
      { valor: 'Cremelo', nome: 'Cremelo (Pele despigmentada e olhos claros)' },
      { valor: 'Branco Pseudo-albino', nome: 'Branco Pseudo-albino' },
      { valor: 'Branco', nome: 'Branco (Comum / Puro)' },
    ],
  },
  {
    grupo: 'Preta',
    opcoes: [
      { valor: 'Preta', nome: 'Preta (Comum)' },
      { valor: 'Preta Maltinta', nome: 'Preta Maltinta (Reflexos avermelhados no flanco/focinho)' },
      { valor: 'Preta Azeviche', nome: 'Preta Azeviche (Reflexos azulados, brilhante)' },
    ],
  },
  {
    grupo: 'Alazã',
    opcoes: [
      { valor: 'Alazã', nome: 'Alazã (Comum)' },
      { valor: 'Alazã Cereja', nome: 'Alazã Cereja (Tom avermelhado vivo)' },
      { valor: 'Alazã Tostada', nome: 'Alazã Tostada (Tom escuro cor de café torrado)' },
      { valor: 'Alazã Amarilha', nome: 'Alazã Amarilha (Crinas e cauda claras/palha)' },
      { valor: 'Alazã Acima da Baia', nome: 'Alazã Acima da Baia' },
    ],
  },
  {
    grupo: 'Castanha',
    opcoes: [
      { valor: 'Castanha', nome: 'Castanha (Comum)' },
      { valor: 'Castanha Clara', nome: 'Castanha Clara' },
      { valor: 'Castanha Escura', nome: 'Castanha Escura' },
      { valor: 'Castanha Pinhão', nome: 'Castanha Pinhão (Tom castanho profundo)' },
      { valor: 'Castanha Zaina', nome: 'Castanha Zaina (Escura quase preta sem marcas)' },
    ],
  },
  {
    grupo: 'Baia',
    opcoes: [
      { valor: 'Baia', nome: 'Baia (Comum)' },
      { valor: 'Baio Amarilo', nome: 'Baio Amarilo / Palomino' },
      { valor: 'Baia Palha', nome: 'Baia Palha (Amarelada bem clara)' },
      { valor: 'Baia Escura', nome: 'Baia Escura' },
      { valor: 'Baia Encerada', nome: 'Baia Encerada' },
      { valor: 'Baia Gateada', nome: 'Baia Gateada (Listra de burro e zebruras)' },
    ],
  },
  {
    grupo: 'Tordilha',
    opcoes: [
      { valor: 'Tordilha', nome: 'Tordilha (Comum)' },
      { valor: 'Tordilha Negra', nome: 'Tordilha Negra (Fase jovem escura)' },
      { valor: 'Tordilha Cardã', nome: 'Tordilha Cardã (Reflexos canela/vinho)' },
      { valor: 'Tordilha Pedrês', nome: 'Tordilha Pedrês (Pintas pretas ou castanhas)' },
      { valor: 'Tordilha Clara', nome: 'Tordilha Clara / Ruça' },
    ],
  },
  {
    grupo: 'Asininos e Muares Exclusivos',
    opcoes: [
      { valor: 'Pelo de Rato', nome: 'Pelo de Rato (Típico asinino/muar)' },
      { valor: 'Ruão', nome: 'Ruão (Mistura de pelos vermelhos, brancos e pretos)' },
    ],
  },
  {
    grupo: 'Pelagens Conjugadas e Compostas',
    opcoes: [
      { valor: 'Apaloosa', nome: 'Apaloosa' },
      { valor: 'Apaloosa Mantada', nome: 'Apaloosa Mantada' },
      { valor: 'Apaloosa Nevado', nome: 'Apaloosa Nevado' },
      { valor: 'Overo', nome: 'Overo (Manchas brancas irregulares sem cruzar dorso)' },
      { valor: 'Tobiano', nome: 'Tobiano (Manchas brancas regulares cruzando o dorso)' },
      { valor: 'Toveira', nome: 'Toveira (Conjugação de Tobiano e Overo)' },
      { valor: 'Rosilha', nome: 'Rosilha' },
      { valor: 'Rosilha Castanha', nome: 'Rosilha Castanha' },
      { valor: 'Rosilha Baia', nome: 'Rosilha Baia' },
      { valor: 'Rosilha Preta', nome: 'Rosilha Preta' },
      { valor: 'Lobuna', nome: 'Lobuna (Pelo cinzento cor de lobo)' },
      { valor: 'Lobuna Clara', nome: 'Lobuna Clara' },
      { valor: 'Lobuna Escura', nome: 'Lobuna Escura' },
      { valor: 'Pampa', nome: 'Pampa (Malhado de branco com outra cor)' },
      { valor: 'Persa ou Leopardo', nome: 'Persa ou Leopardo' },
    ],
  },
];
