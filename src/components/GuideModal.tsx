import React, { useState } from 'react';
import { X, BookOpen, Award, Search } from 'lucide-react';
import { GRUPOS_PELAGENS } from '../data/pelagens';
import { MarcaDiagrama, MarcaCabecaId, MarcaCorpoId } from './MarcaDiagrama';
import { ManualIllustration, marcaSprite, pelagemSprite } from './ManualIllustration';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PARTICULARIDADES_CABECA: { id: MarcaCabecaId; nome: string; descricao: string }[] = [
  { id: 'vestigio-estrela', nome: 'Vestígio de Estrela', descricao: 'Pequena malha de pelos brancos na fronte, sem despigmentação da pele.' },
  { id: 'estrela', nome: 'Estrela', descricao: 'Marca branca na fronte com despigmentação da pele; varia em forma (coração, meia-lua etc.), tamanho e direção.' },
  { id: 'luzeiro', nome: 'Luzeiro', descricao: 'Marca branca com pele despigmentada, maior que a estrela, ocupando grande parte da fronte.' },
  { id: 'filete', nome: 'Filete', descricao: 'Listra fina de pelos brancos na região do chanfro.' },
  { id: 'cordao', nome: 'Cordão', descricao: 'Lista grossa de pelos brancos no chanfro; se não for prolongamento da estrela, chama-se cordão interrompido.' },
  { id: 'beta', nome: 'Beta', descricao: 'Pequena mancha branca localizada entre as narinas.' },
  { id: 'ladre', nome: 'Ladre', descricao: 'Marca branca despigmentada entre as narinas, ligada ao filete ou cordão.' },
  { id: 'bocalvo', nome: 'Bocalvo', descricao: 'Marca branca despigmentada que recobre as narinas e a boca.' },
  { id: 'bebe-em-branco', nome: 'Bebe em Branco', descricao: 'Marca branca restrita ao lábio superior e/ou inferior.' },
  { id: 'frente-aberta', nome: 'Frente Aberta', descricao: 'Cobre a fronte entre os olhos e desce por toda a largura do chanfro até o focinho.' },
  { id: 'malacara', nome: 'Malacara', descricao: 'Cobre toda a fronte e o chanfro — mais larga que a Frente Aberta — descendo em direção à boca.' },
];

const PARTICULARIDADES_CORPO: { id: MarcaCorpoId; nome: string; descricao: string }[] = [
  { id: 'faixa-crucial', nome: 'Faixa Crucial', descricao: 'Faixa escura que vai da cernelha até o início da espádua, representada por um traço.' },
  { id: 'listra-de-burro', nome: 'Listra de Burro', descricao: 'Listra escura que vai da cernelha até a base da cauda, ao longo do dorso.' },
  { id: 'cicatriz', nome: 'Cicatriz', descricao: 'Marca permanente de acidente, cirurgia ou ferimento; representada por uma seta apontando o local.' },
  { id: 'golpe-de-lanca', nome: 'Golpe de Lança', descricao: 'Depressão funda no pescoço, peitorais ou ponta da espádua; indicada por um triângulo.' },
  { id: 'marca-de-ferro', nome: 'Marca de Ferro (ilegível)', descricao: 'Marca a fogo ilegível é considerada cicatriz permanente e indicada por uma seta.' },
  { id: 'manchas-brancas', nome: 'Manchas Brancas (Corpo)', descricao: 'O contorno da mancha deve ser desenhado, preferencialmente sem preenchimento.' },
  { id: 'bragas', nome: 'Bragas / Bragaldo', descricao: 'Malhas despigmentadas encontradas na região abdominal (ventre).' },
];

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [busca, setBusca] = useState('');
  const [aba, setAba] = useState<'pelagens' | 'cabeca' | 'corpo' | 'simbolos'>('pelagens');
  if (!isOpen) return null;

  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  const gruposVisiveis = GRUPOS_PELAGENS.map((grupo) => ({
    ...grupo,
    opcoes: grupo.opcoes.map((opcao, index) => ({ ...opcao, index }))
      .filter((opcao) => !termo || `${opcao.nome} ${grupo.grupo}`.toLocaleLowerCase('pt-BR').includes(termo)),
  })).filter((grupo) => grupo.opcoes.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" aria-labelledby="titulo-manual" className="bg-[#FAF8F5] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-[#D6C4AB]">
        {/* Modal Header */}
        <div className="bg-[#1B5E20] text-white p-5 flex items-center justify-between border-b-2 border-[#8B5A2B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center border border-[#A5D6A7]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="titulo-manual" className="text-lg font-bold font-serif text-[#FAF8F5]">
                Manual Zootécnico de Resenha Equina
              </h3>
              <p className="text-xs text-[#C8E6C9]">
                Cartilha visual de pelagens e particularidades
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar manual"
            className="w-9 h-9 rounded-full bg-[#2E7D32] hover:bg-[#388E3C] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav aria-label="Seções do manual" className="flex gap-1 overflow-x-auto bg-white px-4 sm:px-6 py-2 border-b border-[#EDE6DB] shrink-0">
          {([
            ['pelagens', 'Pelagens'],
            ['cabeca', 'Marcas da cabeça'],
            ['corpo', 'Marcas do corpo'],
            ['simbolos', 'Símbolos'],
          ] as const).map(([id, rotulo]) => (
            <button key={id} type="button" onClick={() => setAba(id)} aria-current={aba === id ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${aba === id ? 'bg-[#1B5E20] text-white' : 'text-[#5C3D2E] hover:bg-[#F1E9DD]'}`}>
              {rotulo}
            </button>
          ))}
        </nav>

        {/* Modal Body */}
        <div key={aba} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-[#2C3E50]">
          {/* 1. Símbolos Oficiais e Convenções Gráficas */}
          {aba === 'simbolos' && <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#1B5E20] text-base mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#8B5A2B]" />
              Símbolos e Convenções Gráficas Oficiais
            </h4>
            <p className="text-xs text-[#6B7280] mb-3 italic">
              As marcações só são registradas dentro do contorno do cavalo em cada silhueta — cliques fora do desenho (na área em branco ao redor) não geram anotação.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
                <span className="font-bold text-[#1B5E20] block text-sm mb-1">
                  X — Rodopio de Pelos
                </span>
                <p className="text-[#6B7280]">
                  Ponto de convergência ou divergência centrífuga dos pelos. Obrigatório na fronte e tábua do pescoço.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
                <span className="font-bold text-[#1B5E20] block text-sm mb-1">
                  → E — Espiga
                </span>
                <p className="text-[#6B7280]">
                  Linha de encontro de duas correntes de pelos em sentidos opostos. Gire a seta (controle de "Direção" ao lado do carimbo) até apontar para o sentido real da convergência observado na pelagem.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
                <span className="font-bold text-[#DC2626] block text-sm mb-1">
                  Traço Vermelho — Cicatrizes / Fogo
                </span>
                <p className="text-[#6B7280]">
                  Assinala cicatrizes permanentes decorrentes de acidentes, cirurgias ou ferros zootécnicos de criatórios.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE6DB]">
                <span className="font-bold text-[#5C3D2E] block text-sm mb-1">
                  Traço Branco — Despigmentação
                </span>
                <p className="text-[#6B7280]">
                  Indica manchas despigmentadas congênitas: calçados nos membros, estrelas, cordões ou manchas corporais.
                </p>
              </div>
            </div>
          </div>}

          {/* 2. Particularidades da Cabeça */}
          {aba === 'cabeca' && <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#5C3D2E] text-base mb-3">
              Particularidades Anatômicas da Cabeça
            </h4>
            <p className="text-xs text-[#6B7280] mb-3">Figura criada por IA ao lado do esquema usado para orientar a marcação. Confira a peculiaridade no animal antes de registrá-la.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {PARTICULARIDADES_CABECA.map((item, index) => (
                <div key={item.id} className="rounded-lg bg-[#FAF8F5] border border-[#EDE6DB] overflow-hidden flex flex-col">
                  <div className="grid grid-cols-[1fr_0.48fr] gap-1 p-1">
                    <ManualIllustration sprite={marcaSprite('cabeca', index)} alt={`Ilustração de ${item.nome}`} className="rounded-md" />
                    <MarcaDiagrama tipo="cabeca" id={item.id} className="w-full h-full rounded-md bg-white" />
                  </div>
                  <div className="p-2">
                    <strong className="text-[#8B5A2B] block mb-0.5">{item.nome}</strong>
                    <p className="text-[#6B7280] leading-snug">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {/* 3. Particularidades do Corpo */}
          {aba === 'corpo' && <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#5C3D2E] text-base mb-3">
              Particularidades Anatômicas do Corpo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {PARTICULARIDADES_CORPO.map((item, index) => (
                <div key={item.id} className="rounded-lg bg-[#FAF8F5] border border-[#EDE6DB] overflow-hidden flex flex-col">
                  <div className="grid grid-cols-2 gap-1 p-1">
                    <ManualIllustration sprite={marcaSprite('corpo', index)} alt={`Ilustração de ${item.nome}`} className="rounded-md" />
                    <MarcaDiagrama tipo="corpo" id={item.id} className="w-full h-full rounded-md bg-white" />
                  </div>
                  <div className="p-2.5">
                    <strong className="text-[#8B5A2B] block mb-0.5">{item.nome}</strong>
                    <p className="text-[#6B7280] leading-snug">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {/* 4. Catálogo de Pelagens */}
          {aba === 'pelagens' && <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h4 className="font-bold font-serif text-[#1B5E20] text-lg">Cartilha visual de pelagens</h4>
                <p className="text-xs text-[#6B7280] mt-1">Uma figura para cada pelagem do seletor da ficha. As imagens de animais fictícios foram geradas por IA e servem para comparação visual; a identificação exige observação do animal.</p>
              </div>
              <label className="relative block shrink-0 sm:w-56">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <span className="sr-only">Buscar pelagem</span>
                <input type="search" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar pelagem..." className="w-full rounded-xl border border-[#D6C4AB] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20" />
              </label>
            </div>
            {gruposVisiveis.length === 0 && <p className="rounded-xl bg-[#FAF8F5] p-5 text-[#6B7280]">Nenhuma pelagem encontrada para “{busca}”.</p>}
            <div className="space-y-6">
              {gruposVisiveis.map((grp) => (
                <section key={grp.grupo} aria-label={grp.grupo}>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#8B5A2B] mb-2">{grp.grupo} <span className="font-normal text-[#6B7280]">· {grp.opcoes.length}</span></h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {grp.opcoes.map((op) => (
                      <article key={op.valor} className="overflow-hidden rounded-xl border border-[#EDE6DB] bg-[#FAF8F5] shadow-sm">
                        <ManualIllustration sprite={pelagemSprite(grp.grupo, op.index)} alt={`Animal fictício com pelagem ${op.valor}`} />
                        <div className="p-2.5">
                          <strong className="block text-xs leading-snug text-[#2C3E50]">{op.valor}</strong>
                          {op.nome !== op.valor && <p className="text-[11px] leading-snug text-[#6B7280] mt-0.5">{op.nome}</p>}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F5] p-4 border-t border-[#EDE6DB] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1B5E20] text-white hover:bg-[#2E7D32] transition-colors"
          >
            Entendido, Voltar à Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
