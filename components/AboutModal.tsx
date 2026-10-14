'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-sm">
              ESC
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Sobre o ESCSIMULADOS
              </h2>
              <span className="text-[11px] font-bold text-pink-600">
                Módulos de Treino por DRIK
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            O <strong>ESCSIMULADOS</strong> é uma plataforma moderna, dinâmica e <strong>100% gratuita</strong> criada para democratizar a preparação de estudantes brasileiros do Ensino Fundamental e Médio para avaliações governamentais e olimpíadas científicas.
          </p>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Filosofia: Zero Barreiras de Acesso
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              O site <strong>não exige cadastro, email ou login</strong>. Qualquer aluno ou professor pode entrar, escolher o simulado desejado e começar imediatamente com um clique. Todo o progresso fica salvo de forma segura no próprio navegador do usuário (localStorage).
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
              Principais Exames Atendidos:
            </strong>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Prova Paulista (SP)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>SARESP Estadual</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>ENEM Nacional</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>OBMEP (Matemática)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>OBA & MOBFOG</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>SPAECE & SAEB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Identidade visual Studio Stitch · 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
