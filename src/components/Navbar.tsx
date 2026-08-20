import React from 'react';
import { Menu, PlusCircle, History, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNew: () => void;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNew,
  onOpenHistory,
  onOpenGuide,
  onToggleMenu,
  isMenuOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#1B5E20] text-white shadow-lg border-b-4 border-[#8B5A2B]">
      {/* Top decorative texture bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#2E7D32] via-[#B87333] to-[#1B5E20]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-menu-sanduiche"
            onClick={onToggleMenu}
            className="p-2 -ml-2 rounded-lg text-[#E8F5E9] hover:bg-[#2E7D32] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] sm:hidden"
            aria-label="Abrir menu principal"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onNew}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#EDE6DB] border-2 border-[#D4A373] flex items-center justify-center shadow-md transform transition hover:scale-105">
              <span className="text-2xl" role="img" aria-label="Cavalo">🐴</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight font-serif text-[#FAF8F5]">
                  Amorimpec
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#8B5A2B] text-[#FAF8F5] font-semibold uppercase tracking-wider hidden sm:inline-block border border-[#D4A373]">
                  Zootecnia Rural
                </span>
              </div>
              <p className="text-xs text-[#C8E6C9] font-medium tracking-wide">
                Ficha Oficial de Resenha Equina, Asnina e Muar
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            id="nav-btn-nova-resenha"
            onClick={onNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#2E7D32] text-white hover:bg-[#388E3C] border border-[#4CAF50]/30 shadow-sm transition-all hover:shadow"
          >
            <PlusCircle className="w-4 h-4 text-[#A5D6A7]" />
            Nova Resenha
          </button>

          <button
            type="button"
            id="nav-btn-historico"
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#5C3D2E] text-white hover:bg-[#6D4937] border border-[#8B5A2B] shadow-sm transition-all hover:shadow"
          >
            <History className="w-4 h-4 text-[#D4A373]" />
            Histórico
          </button>

          <button
            type="button"
            id="nav-btn-guia-pelagens"
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#FAF8F5] text-[#1B5E20] hover:bg-white border border-[#D4A373] shadow-sm transition-all hover:shadow"
          >
            <BookOpen className="w-4 h-4 text-[#8B5A2B]" />
            Manual Zootécnico
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-[#244728] border-t border-[#3E6B44] px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            type="button"
            onClick={() => {
              onNew();
              onToggleMenu();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-white bg-[#2E7D32] hover:bg-[#388E3C]"
          >
            <PlusCircle className="w-5 h-5 text-[#A5D6A7]" />
            Nova Ficha de Resenha
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenHistory();
              onToggleMenu();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-white bg-[#5C3D2E] hover:bg-[#6D4937]"
          >
            <History className="w-5 h-5 text-[#D4A373]" />
            Fichas Salvas no Histórico
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenGuide();
              onToggleMenu();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-[#1B5E20] bg-[#FAF8F5] hover:bg-white"
          >
            <BookOpen className="w-5 h-5 text-[#8B5A2B]" />
            Manual de Pelagens & Marcas
          </button>
        </div>
      )}
    </header>
  );
};
