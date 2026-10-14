'use client';

import React from 'react';
import { SimuladoResult } from '@/lib/types';
import { History, X, CheckCircle2, Clock, Trash2, ArrowRight, Award } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: SimuladoResult[];
  onSelectResult: (result: SimuladoResult) => void;
  onClearHistory: () => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  results,
  onSelectResult,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  const totalTaken = results.length;
  const avgScore = totalTaken > 0
    ? Math.round(results.reduce((acc, r) => acc + r.scorePercentage, 0) / totalTaken)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
              <History className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Meu Histórico de Simulados
              </h2>
              <p className="text-xs text-slate-500">
                Salvo 100% no seu navegador (sem necessidade de conta ou login)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        {totalTaken > 0 && (
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Simulados Realizados
              </span>
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                {totalTaken}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Média de Aproveitamento
              </span>
              <span className="text-2xl font-extrabold text-pink-600 tabular-nums">
                {avgScore}%
              </span>
            </div>
          </div>
        )}

        {/* List of past results */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {totalTaken === 0 ? (
            <div className="text-center py-10 text-slate-500 space-y-2">
              <Award className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Você ainda não concluiu nenhum simulado.</p>
              <p className="text-xs text-slate-400">
                Escolha uma prova na página inicial para começar seu treino livre!
              </p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  onSelectResult(res);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="text-pink-600 font-bold">{res.categoryName}</span>
                    <span>·</span>
                    <span>{res.completedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-pink-600 transition-colors mt-0.5">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{res.correctCount} de {res.totalQuestions} acertos</span>
                    <span>·</span>
                    <span className="font-mono">{Math.floor(res.elapsedSeconds / 60)}m {res.elapsedSeconds % 60}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-base font-extrabold tabular-nums ${
                      res.scorePercentage >= 70 ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {res.scorePercentage}%
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {totalTaken > 0 && (
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar histórico</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
