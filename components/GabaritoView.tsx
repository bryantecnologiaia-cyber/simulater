'use client';

import React, { useState, useEffect } from 'react';
import { SimuladoResult, Question } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Printer,
  Share2,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface GabaritoViewProps {
  result: SimuladoResult;
  onRetry: () => void;
  onRetryMistakes: () => void;
  onChooseAnother: () => void;
}

export function GabaritoView({
  result,
  onRetry,
  onRetryMistakes,
  onChooseAnother,
}: GabaritoViewProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  // Trigger confetti on good result
  useEffect(() => {
    if (result.scorePercentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#EC4899', '#F43F5E', '#10B981'],
      });
    }
  }, [result.scorePercentage]);

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const toggleExpand = (qId: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const expandAll = () => {
    const allExp: Record<number, boolean> = {};
    result.questions.forEach((q) => {
      allExp[q.id] = true;
    });
    setExpandedQuestions(allExp);
  };

  const collapseAll = () => {
    setExpandedQuestions({});
  };

  const handleShare = async () => {
    const text = `🏆 Fiz o simulado "${result.title}" no ESCSIMULADOS!\n🎯 Aproveitamento: ${result.scorePercentage}% (${result.correctCount}/${result.totalQuestions} acertos)\n⏱️ Tempo: ${formatTime(result.elapsedSeconds)}\nTreine gratuitamente e sem cadastro no ESCSIMULADOS por DRIK!`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter questions list
  const filteredQuestions = result.questions.filter((q) => {
    const userAns = result.answers[q.id];
    const isCorrect = userAns === q.correctOption;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  // Performance Diagnosis
  const getFeedbackMessage = (pct: number) => {
    if (pct >= 85) {
      return {
        title: 'Excelente Desempenho!',
        desc: 'Você dominou os conteúdos e habilidades exigidos neste simulado. Continue treinando para gabaritar a prova oficial!',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        scoreColor: 'text-emerald-600',
      };
    } else if (pct >= 60) {
      return {
        title: 'Bom Aproveitamento!',
        desc: 'Você está no caminho certo. Revise as questões que errou no gabarito comentado abaixo para fixar os conceitos-chave.',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        scoreColor: 'text-amber-600',
      };
    } else {
      return {
        title: 'Continue Praticando!',
        desc: 'Simulados servem exatamente para identificar pontos fracos antes do dia da prova. Leia as Dicas DRIK com calma e refaça.',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        scoreColor: 'text-rose-600',
      };
    }
  };

  const feedback = getFeedbackMessage(result.scorePercentage);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <button
          onClick={onChooseAnother}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 cursor-pointer self-start"
        >
          <span>← Voltar à lista de simulados</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Copiado para área de transferência!' : 'Compartilhar'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Gabarito</span>
          </button>
        </div>
      </div>

      {/* Primary Score Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative overflow-hidden print-page">
        {/* Background gradient decorative element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/40 via-pink-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-pink-600 mb-2">
            <span className="px-2 py-0.5 rounded bg-pink-100 uppercase tracking-wider">
              {result.categoryName}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">{result.gradeLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">{result.completedAt}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resultado: {result.title}
          </h1>

          {/* Metric cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 pb-6 border-b border-slate-100">
            {/* Aproveitamento */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aproveitamento
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className={`text-3xl sm:text-4xl font-extrabold tabular-nums ${feedback.scoreColor}`}>
                  {result.scorePercentage}%
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1">
                Nota: {((result.correctCount / result.totalQuestions) * 10).toFixed(1)} / 10
              </span>
            </div>

            {/* Acertos */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/70 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Acertos
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tabular-nums">
                  {result.correctCount}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">
                  / {result.totalQuestions}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1">
                Respostas corretas
              </span>
            </div>

            {/* Erros / Em branco */}
            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200/70 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Erros
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-rose-700 tabular-nums">
                  {result.incorrectCount}
                </span>
                {result.skippedCount > 0 && (
                  <span className="text-xs text-rose-500 font-medium">
                    ({result.skippedCount} em branco)
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-rose-700 mt-1">
                Necessitam revisão
              </span>
            </div>

            {/* Tempo */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Tempo Gasto
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
                  {formatTime(result.elapsedSeconds)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 mt-1">
                Média: {(result.elapsedSeconds / (result.totalQuestions || 1)).toFixed(0)}s por questão
              </span>
            </div>
          </div>

          {/* Feedback & DRIK Diagnosis */}
          <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${feedback.badgeClass}`}>
                  {feedback.title}
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {feedback.desc}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
              {result.incorrectCount > 0 && (
                <button
                  onClick={onRetryMistakes}
                  className="px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Revisar Somente os {result.incorrectCount} Erros</span>
                </button>
              )}

              <button
                onClick={onRetry}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Simulado</span>
              </button>

              <button
                onClick={onChooseAnother}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Escolher Outro</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs for Commented Gabarito */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pink-600" />
          <span className="text-sm font-extrabold text-slate-900">
            Gabarito Comentado DRIK:
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({result.totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Acertos ({result.correctCount})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filterMode === 'incorrect' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Erros ({result.incorrectCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={expandAll}
            className="hover:text-pink-600 underline cursor-pointer"
          >
            Expandir todas
          </button>
          <span>·</span>
          <button
            onClick={collapseAll}
            className="hover:text-pink-600 underline cursor-pointer"
          >
            Recolher todas
          </button>
        </div>
      </div>

      {/* Questions Breakdown List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const userAns = result.answers[q.id];
          const isCorrect = userAns === q.correctOption;
          const isSkipped = !userAns;
          const isExpanded = expandedQuestions[q.id] ?? true;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${
                isCorrect
                  ? 'border-emerald-200/90 shadow-xs'
                  : 'border-rose-200/90 shadow-xs'
              }`}
            >
              {/* Question Header Accordion Bar */}
              <div
                onClick={() => toggleExpand(q.id)}
                className={`p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                  isCorrect ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'bg-rose-50/40 hover:bg-rose-50/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-sm ${
                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-800">
                        Questão {q.id}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-500 truncate">
                        {q.topic}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {q.text}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-medium text-slate-500 block">Sua resposta:</span>
                    <span className={`text-xs font-extrabold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {userAns ? `Alternativa (${userAns})` : 'Em branco'}
                    </span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-medium text-slate-500 block">Correta:</span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      Alternativa ({q.correctOption})
                    </span>
                  </div>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Question Full Content & Explanation */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-100 space-y-5">
                  {/* Context quote if present */}
                  {q.contextText && (
                    <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 italic">
                      {q.contextText}
                    </div>
                  )}

                  <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    {q.text}
                  </div>

                  {/* Options List with Results */}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isChosen = userAns === opt.id;
                      const isOfficialCorrect = q.correctOption === opt.id;

                      let optClass = 'border-slate-200 bg-white text-slate-700';
                      let badge = null;

                      if (isOfficialCorrect) {
                        optClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-400/50';
                        badge = (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded ml-2 shrink-0">
                            Gabarito Oficial ✓
                          </span>
                        );
                      } else if (isChosen && !isOfficialCorrect) {
                        optClass = 'border-rose-400 bg-rose-50 text-rose-950 font-medium';
                        badge = (
                          <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded ml-2 shrink-0">
                            Sua escolha ✗
                          </span>
                        );
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center justify-between p-3 rounded-xl border ${optClass}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isOfficialCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isChosen
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="text-xs sm:text-sm">{opt.text}</span>
                          </div>
                          {badge}
                        </div>
                      );
                    })}
                  </div>

                  {/* Commented Resolution */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        Resolução Comentada
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>

                  {/* Dica DRIK Special Box */}
                  <div className="bg-gradient-to-r from-pink-50 via-amber-50 to-pink-50 border border-pink-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-extrabold text-pink-700 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Dica DRIK para a Prova</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {q.drikTip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="text-xs text-slate-500 font-semibold">
          Pratique com regularidade para alcançar excelência em avaliações estaduais e olimpíadas.
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer</span>
          </button>

          <button
            onClick={onChooseAnother}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Explorar Outros Simulados</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
