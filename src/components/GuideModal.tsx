import React from 'react';
import { X, BookOpen, Check, Award, HelpCircle } from 'lucide-react';
import { GRUPOS_PELAGENS } from '../data/pelagens';
import { MarcaDiagrama, MarcaCabecaId, MarcaCorpoId } from './MarcaDiagrama';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-4 border-[#8B5A2B]">
        {/* Modal Header */}
        <div className="bg-[#1B5E20] text-white p-5 flex items-center justify-between border-b-2 border-[#8B5A2B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center border border-[#A5D6A7]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-[#FAF8F5]">
                Manual Zootécnico de Resenha Equina
              </h3>
              <p className="text-xs text-[#C8E6C9]">
                Catálogo oficial de pelagens, particularidades da cabeça e membros
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2E7D32] hover:bg-[#388E3C] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#2C3E50]">
          {/* 1. Símbolos Oficiais e Convenções Gráficas */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
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
                  → E ou E ← — Espiga
                </span>
                <p className="text-[#6B7280]">
                  Linha de encontro de duas correntes de pelos em sentidos opostos. A ponta da seta indica o sentido da convergência.
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
          </div>

          {/* 2. Particularidades da Cabeça */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#5C3D2E] text-base mb-3">
              Particularidades Anatômicas da Cabeça
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {PARTICULARIDADES_CABECA.map((item) => (
                <div key={item.id} className="rounded-lg bg-[#FAF8F5] border border-[#EDE6DB] overflow-hidden flex flex-col">
                  <div className="w-full aspect-[497/1020]">
                    <MarcaDiagrama tipo="cabeca" id={item.id} className="w-full h-full" />
                  </div>
                  <div className="p-2">
                    <strong className="text-[#8B5A2B] block mb-0.5">{item.nome}</strong>
                    <p className="text-[#6B7280] leading-snug">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Particularidades do Corpo */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#5C3D2E] text-base mb-3">
              Particularidades Anatômicas do Corpo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {PARTICULARIDADES_CORPO.map((item) => (
                <div key={item.id} className="rounded-lg bg-[#FAF8F5] border border-[#EDE6DB] overflow-hidden flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 aspect-[999/1003] shrink-0">
                    <MarcaDiagrama tipo="corpo" id={item.id} className="w-full h-full" />
                  </div>
                  <div className="p-2.5">
                    <strong className="text-[#8B5A2B] block mb-0.5">{item.nome}</strong>
                    <p className="text-[#6B7280] leading-snug">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Catálogo de Pelagens */}
          <div className="bg-white p-5 rounded-2xl border border-[#EDE6DB] shadow-sm">
            <h4 className="font-bold font-serif text-[#1B5E20] text-base mb-3">
              Catálogo Oficial de Pelagens Brasileiras
            </h4>
            <div className="space-y-3">
              {GRUPOS_PELAGENS.map((grp) => (
                <div key={grp.grupo} className="border-b border-[#EDE6DB] pb-2 last:border-b-0">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#8B5A2B] block mb-1">
                    {grp.grupo}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {grp.opcoes.map((op) => (
                      <span
                        key={op.valor}
                        className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EDE6DB] text-[#2C3E50]"
                      >
                        {op.nome}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
