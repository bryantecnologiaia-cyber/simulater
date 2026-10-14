'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, History, Search, Menu, X, Award, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenHistory: () => void;
  onOpenGenerator: () => void;
  onOpenAbout: () => void;
  onSearchFocus: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeExamCategory?: string;
  onSelectCategory?: (category: any) => void;
}

export function Header({
  onGoHome,
  onOpenHistory,
  onOpenGenerator,
  onOpenAbout,
  onSearchFocus,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Lockup with Warm Yellow & Vivid Pink */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-98 cursor-pointer focus:outline-none"
          title="Ir para o início do ESCSIMULADOS"
        >
          {/* Logo Icon with Yellow/Pink Stitch gradient */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-pink-600 to-amber-500 text-lg tracking-tighter">
                ESC
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors">
                ESC<span className="text-amber-500">SIMULADOS</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">
                DRIK
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              100% Gratuito · Sem Cadastro
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single line, no wrapping) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <button
            onClick={onGoHome}
            className="hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Início
          </button>
          <button
            onClick={() => {
              onGoHome();
              if (onSelectCategory) onSelectCategory('prova-paulista');
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Prova Paulista
          </button>
          <button
            onClick={() => {
              onGoHome();
              if (onSelectCategory) onSelectCategory('enem');
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            ENEM & SARESP
          </button>
          <button
            onClick={() => {
              onGoHome();
              if (onSelectCategory) onSelectCategory('obmep');
            }}
            className="hover:text-pink-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            OBMEP & OBA
          </button>
          <button
            onClick={onOpenGenerator}
            className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors whitespace-nowrap cursor-pointer text-amber-700 font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Gerador DRIK
          </button>
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer text-slate-600"
          >
            <History className="w-4 h-4" />
            Meu Histórico
          </button>
        </nav>

        {/* Zone 3: Search & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Bar Input */}
          <div className="relative hidden sm:block w-48 md:w-56 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar prova, matéria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm bg-slate-100/90 border border-transparent focus:border-pink-400 focus:bg-white rounded-lg focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
          </div>

          <button
            onClick={onOpenGenerator}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-lg shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            Treinar Agora
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="pt-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar prova ou disciplina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <button
              onClick={() => {
                onGoHome();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-50 hover:bg-slate-100 text-slate-800"
            >
              Início
            </button>
            <button
              onClick={() => {
                onGoHome();
                if (onSelectCategory) onSelectCategory('prova-paulista');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-50 hover:bg-slate-100 text-slate-800"
            >
              Prova Paulista
            </button>
            <button
              onClick={() => {
                onGoHome();
                if (onSelectCategory) onSelectCategory('enem');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-50 hover:bg-slate-100 text-slate-800"
            >
              ENEM & SARESP
            </button>
            <button
              onClick={() => {
                onGoHome();
                if (onSelectCategory) onSelectCategory('obmep');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg text-left bg-slate-50 hover:bg-slate-100 text-slate-800"
            >
              OBMEP & OBA
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenGenerator();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-bold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Gerador DRIK
            </button>
            <button
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              Meu Histórico
            </button>
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              title="Sobre o ESCSIMULADOS"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
