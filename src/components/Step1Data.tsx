import React from 'react';
import { ResenhaData, Especie } from '../types';
import { GRUPOS_PELAGENS } from '../data/pelagens';
import { ESTADOS_BRASIL } from '../data/estados';
import {
  User,
  MapPin,
  Phone,
  Building,
  UserCheck,
  Award,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface Step1DataProps {
  data: ResenhaData;
  onChange: (field: keyof ResenhaData, value: string) => void;
  onNext: () => void;
  onOpenGuide: () => void;
}

export const Step1Data: React.FC<Step1DataProps> = ({
  data,
  onChange,
  onNext,
  onOpenGuide,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  // Só mostra os grupos de pelagem compatíveis com a espécie selecionada
  // (ex: "Pelo de Rato" e "Ruão" são exclusivos de asininos/muares)
  const gruposPelagensDisponiveis = GRUPOS_PELAGENS.filter(
    (grp) => !grp.especies || grp.especies.includes(data.animEspecie)
  );

  const handleEspecieChange = (novaEspecie: Especie) => {
    onChange('animEspecie', novaEspecie);
    // Se a pelagem já escolhida não existir mais para a nova espécie, limpa
    const grupoDaPelagemAtual = GRUPOS_PELAGENS.find((grp) =>
      grp.opcoes.some((op) => op.valor === data.animCor)
    );
    if (grupoDaPelagemAtual?.especies && !grupoDaPelagemAtual.especies.includes(novaEspecie)) {
      onChange('animCor', '');
    }
  };

  // Formatador de telefone brasileiro: (99) 99999-9999
  const handlePhoneMask = (field: 'propTel' | 'resTel', val: string) => {
    let digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      onChange(field, digits.length > 0 ? `(${digits}` : '');
    } else if (digits.length <= 6) {
      onChange(field, `(${digits.slice(0, 2)}) ${digits.slice(2)}`);
    } else if (digits.length <= 10) {
      onChange(field, `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`);
    } else {
      onChange(field, `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* 1. DADOS DO PROPRIETÁRIO */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#EDE6DB] hover:border-[#8B5A2B]/40 transition-colors">
        <div className="flex items-center gap-3 pb-3 mb-5 border-b-2 border-[#E8F5E9]">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#1B5E20]">
              1. Dados do Proprietário & Propriedade
            </h2>
            <p className="text-xs text-[#6B7280]">
              Informações do criador ou detentor legal do animal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="propNome" className="block text-sm font-bold text-[#374151] mb-1.5">
              Nome Completo do Proprietário <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="propNome"
                required
                placeholder="Ex: João da Silva Amorim"
                value={data.propNome}
                onChange={(e) => onChange('propNome', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="propPropriedade" className="block text-sm font-bold text-[#374151] mb-1.5">
              Fazenda / Haras / Rancho
            </label>
            <div className="relative">
              <input
                type="text"
                id="propPropriedade"
                placeholder="Ex: Fazenda Santa Maria"
                value={data.propPropriedade || ''}
                onChange={(e) => onChange('propPropriedade', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <Building className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="propTel" className="block text-sm font-bold text-[#374151] mb-1.5">
              Telefone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="propTel"
                required
                placeholder="(99) 99999-9999"
                value={data.propTel}
                onChange={(e) => handlePhoneMask('propTel', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <Phone className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="propMunicipio" className="block text-sm font-bold text-[#374151] mb-1.5">
              Município <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="propMunicipio"
                required
                placeholder="Ex: Imperatriz"
                value={data.propMunicipio}
                onChange={(e) => onChange('propMunicipio', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <MapPin className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="propUF" className="block text-sm font-bold text-[#374151] mb-1.5">
              Estado (UF) <span className="text-red-500">*</span>
            </label>
            <select
              id="propUF"
              required
              value={data.propUF}
              onChange={(e) => onChange('propUF', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            >
              <option value="">Selecione o Estado...</option>
              {ESTADOS_BRASIL.map((uf) => (
                <option key={uf.sigla} value={uf.sigla}>
                  {uf.sigla} - {uf.nome} ({uf.regiao})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. DADOS DO RESENHADOR */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#EDE6DB] hover:border-[#8B5A2B]/40 transition-colors">
        <div className="flex items-center gap-3 pb-3 mb-5 border-b-2 border-[#F5EBE6]">
          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#8B5A2B] flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-[#5C3D2E]">
              2. Dados do Resenhador / Técnico
            </h2>
            <p className="text-xs text-[#6B7280]">
              Identificação do Médico Veterinário ou Técnico Zootécnico responsável
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label htmlFor="resNome" className="block text-sm font-bold text-[#374151] mb-1.5">
              Nome do Resenhador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="resNome"
              required
              placeholder="Ex: Dr. Carlos Ferreira"
              value={data.resNome}
              onChange={(e) => onChange('resNome', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#5C3D2E] focus:ring-2 focus:ring-[#5C3D2E]/20 text-[#1F2937] text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label htmlFor="resTel" className="block text-sm font-bold text-[#374151] mb-1.5">
              Telefone do Resenhador <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="resTel"
              required
              placeholder="(99) 99999-9999"
              value={data.resTel}
              onChange={(e) => handlePhoneMask('resTel', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#5C3D2E] focus:ring-2 focus:ring-[#5C3D2E]/20 text-[#1F2937] text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label htmlFor="resRegistro" className="block text-sm font-bold text-[#374151] mb-1.5">
              CRMV / Registro Técnico
            </label>
            <div className="relative">
              <input
                type="text"
                id="resRegistro"
                placeholder="Ex: CRMV-MA 1234 / ABCCMM"
                value={data.resRegistro || ''}
                onChange={(e) => onChange('resRegistro', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#5C3D2E] focus:ring-2 focus:ring-[#5C3D2E]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <Award className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. IDENTIFICAÇÃO DO ANIMAL */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#EDE6DB] hover:border-[#8B5A2B]/40 transition-colors">
        <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-[#E8F5E9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-[#1B5E20]">
                3. Identificação Zootécnica do Animal
              </h2>
              <p className="text-xs text-[#6B7280]">
                Espécie, pelagem oficial brasileira, sexo e dados cadastrais
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-abrir-manual-pelagens"
            onClick={onOpenGuide}
            className="text-xs font-semibold text-[#8B5A2B] hover:text-[#5C3D2E] flex items-center gap-1 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#D4A373] hover:bg-[#F5EBE6] transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            Catálogo de Pelagens
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="animNome" className="block text-sm font-bold text-[#374151] mb-1.5">
              Nome do Animal / Registro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="animNome"
              required
              placeholder="Ex: Alazão do Sertão / Barão da Amorimpec"
              value={data.animNome}
              onChange={(e) => onChange('animNome', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label htmlFor="animEspecie" className="block text-sm font-bold text-[#374151] mb-1.5">
              Espécie <span className="text-red-500">*</span>
            </label>
            <select
              id="animEspecie"
              required
              value={data.animEspecie}
              onChange={(e) => handleEspecieChange(e.target.value as Especie)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            >
              <option value="Equina">🐴 Equina (Cavalo / Égua)</option>
              <option value="Asnina">🫏 Asnina (Jumento / Jumenta)</option>
              <option value="Muar">🐎 Muar (Burro / Mula)</option>
            </select>
          </div>

          <div>
            <label htmlFor="animSexo" className="block text-sm font-bold text-[#374151] mb-1.5">
              Sexo <span className="text-red-500">*</span>
            </label>
            <select
              id="animSexo"
              required
              value={data.animSexo}
              onChange={(e) => onChange('animSexo', e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            >
              <option value="">Selecione...</option>
              <option value="Macho Inteiro">Macho Inteiro (Garanhão)</option>
              <option value="Macho Castrado">Macho Castrado</option>
              <option value="Fêmea">Fêmea (Égua / Matriz)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="animCor" className="block text-sm font-bold text-[#374151] mb-1.5">
              Pelagem Oficial (Padrão Zootécnico Brasileiro) <span className="text-red-500">*</span>
            </label>
            <select
              id="animCor"
              required
              value={data.animCor}
              onChange={(e) => onChange('animCor', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all font-sans"
            >
              <option value="">Selecione a Pelagem Oficial...</option>
              {gruposPelagensDisponiveis.map((grp) => (
                <optgroup key={grp.grupo} label={grp.grupo} className="font-bold text-[#1B5E20]">
                  {grp.opcoes.map((pel) => (
                    <option key={pel.valor} value={pel.valor} className="font-normal text-[#1F2937]">
                      {pel.nome}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="animNasc" className="block text-sm font-bold text-[#374151] mb-1.5">
              Data de Nascimento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="animNasc"
                required
                value={data.animNasc}
                onChange={(e) => onChange('animNasc', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
              />
              <Calendar className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="animRaca" className="block text-sm font-bold text-[#374151] mb-1.5">
              Raça do Animal (Opcional)
            </label>
            <input
              type="text"
              id="animRaca"
              placeholder="Ex: Mangalarga Marchador / Quarto de Milha / Crioulo / Campolina"
              value={data.animRaca || ''}
              onChange={(e) => onChange('animRaca', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            />
          </div>

          <div>
            <label htmlFor="animChip" className="block text-sm font-bold text-[#374151] mb-1.5">
              Microchip / RGN (Opcional)
            </label>
            <input
              type="text"
              id="animChip"
              placeholder="Ex: 981098123456789"
              value={data.animChip || ''}
              onChange={(e) => onChange('animChip', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-[#FAF8F5] focus:bg-white focus:border-[#1B5E20] focus:ring-2 focus:ring-[#1B5E20]/20 text-[#1F2937] text-sm font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Botão de Avanço */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          id="btn-avancar-etapa2"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-[#1B5E20] text-white hover:bg-[#2E7D32] border border-[#8B5A2B] shadow-md hover:shadow-lg transition-all transform active:scale-98"
        >
          <span>Avançar para Resenha Gráfica (Desenhos)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
