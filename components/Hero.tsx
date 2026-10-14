'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, BookOpen } from 'lucide-react';

interface HeroProps {
  onStartPopular: () => void;
  onOpenGenerator: () => void;
}

export function Hero({ onStartPopular, onOpenGenerator }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-pink-50/30 to-slate-50 pt-8 pb-12 md:pt-12 md:pb-16 border-b border-slate-200/60">
      {/* Subtle Stitch-inspired geometric background elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Top Eyebrow / Kicker (Text only, no pill capsule) */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-pink-600 uppercase tracking-wider">
              <span>Plataforma Oficial de Prática</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-amber-600 font-extrabold">Módulos de Treino DRIK</span>
            </div>

            {/* Main Headline - Required exact phrasing */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-tight">
              Treine para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">Prova Paulista</span>, ENEM, OBMEP e muito mais.{' '}
              <span className="text-pink-600 block sm:inline">100% Gratuito e sem cadastro!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Desenvolvido com o design vibrante do <strong>Studio Stitch</strong> para estudantes do Ensino Fundamental e Médio. Escolha seu simulado, responda no cronômetro oficial e receba o <strong>gabarito comentado instantâneo</strong> com resolução passo a passo.
            </p>

            {/* Key Value Highlights (Accessible, text-based, no fake stats) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Sem login ou senha</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Gabarito com Dica DRIK</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Salva tudo no navegador</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onStartPopular}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                <span>Começar Simulado Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenGenerator}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm md:text-base font-bold text-amber-900 bg-amber-400/90 hover:bg-amber-400 rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-950" />
                <span>Criar Simulado Personalizado</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 w-full bg-slate-100">
                <Image
                  src="/images/hero_banner.jpg"
                  alt="Estudantes praticando simulados da Prova Paulista e Olimpíadas no ESCSIMULADOS"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlay Badge Bar */}
              <div className="p-4 bg-white/95 backdrop-blur-xs flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Módulos DRIK Atualizados 2026
                  </span>
                </div>
                <span className="text-xs font-semibold text-amber-600">
                  Ensino Fundamental & Médio
                </span>
              </div>
            </div>

            {/* Decorative Stitch Stitching Frame behind */}
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-dashed border-pink-300 pointer-events-none -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
