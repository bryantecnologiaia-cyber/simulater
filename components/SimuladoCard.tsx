'use client';

import React from 'react';
import { Simulado, SimuladoResult, SimuladoSession } from '@/lib/types';
import { Clock, HelpCircle, ArrowRight, RotateCcw, CheckCircle, Zap } from 'lucide-react';

interface SimuladoCardProps {
  simulado: Simulado;
  savedSession: SimuladoSession | null;
  lastResult: SimuladoResult | null;
  onStart: (simulado: Simulado, resume?: boolean) => void;
}

export function SimuladoCard({
  simulado,
  savedSession,
  lastResult,
  onStart,
}: SimuladoCardProps) {
  const hasSavedDraft = savedSession && !savedSession.isFinished && Object.keys(savedSession.answers).length > 0;
  const answeredCount = savedSession ? Object.keys(savedSession.answers).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-pink-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
      {/* Top subtle highlight stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Category & Status Bar (Clean unboxed metadata) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-pink-600">
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-50 border border-pink-200/60">
              {simulado.categoryName}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600 font-semibold">{simulado.gradeLabel}</span>
          </div>

          {lastResult && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 tabular-nums">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Última: {lastResult.scorePercentage}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug">
          {simulado.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {simulado.description}
        </p>

        {/* Clean unboxed metadata with separators */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-3.5 pt-3 border-t border-slate-100">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
            {simulado.questionCount} questões
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {simulado.estimatedMinutes} min
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Dificuldade: <strong className="text-slate-700">{simulado.questions[0]?.difficulty || 'Média'}</strong></span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {simulado.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
        {hasSavedDraft ? (
          <div className="w-full flex flex-col gap-2">
            <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center justify-between border border-amber-200/60">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600" />
                Rascunho salvo ({answeredCount}/{simulado.questionCount} respondidas)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onStart(simulado, true)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continuar Simulado</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onStart(simulado, false)}
                title="Reiniciar do zero"
                className="p-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onStart(simulado, false)}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-pink-600 hover:to-rose-500 hover:text-white rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Iniciar Simulado Gratuito</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
