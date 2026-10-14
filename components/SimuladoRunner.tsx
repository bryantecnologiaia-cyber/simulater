'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Simulado, SimuladoSession, Question } from '@/lib/types';
import { saveCurrentSession } from '@/lib/storage';
import {
  Clock,
  Play,
  Pause,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  HelpCircle,
  X,
  RotateCcw,
  BookOpen,
  Send,
  Sparkles,
} from 'lucide-react';

interface SimuladoRunnerProps {
  simulado: Simulado;
  initialSession: SimuladoSession | null;
  onFinish: (session: SimuladoSession) => void;
  onExit: () => void;
}

export function SimuladoRunner({
  simulado,
  initialSession,
  onFinish,
  onExit,
}: SimuladoRunnerProps) {
  // Session states
  const [currentIndex, setCurrentIndex] = useState(initialSession?.currentQuestionIndex ?? 0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>>(
    initialSession?.answers ?? {}
  );
  const [flagged, setFlagged] = useState<Record<number, boolean>>(initialSession?.flagged ?? {});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<number, string[]>>(
    initialSession?.eliminatedOptions ?? {}
  );

  // Timer states
  const [isTimerEnabled, setIsTimerEnabled] = useState(initialSession?.isTimerActive ?? true);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSession?.elapsedSeconds ?? 0);

  // UI tool modals
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');

  const questions = simulado.questions;
  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerEnabled && isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerEnabled, isTimerRunning]);

  const [startedAt] = useState(() => initialSession?.startedAt || Date.now());

  // Auto-save session state to localStorage on changes
  useEffect(() => {
    const session: SimuladoSession = {
      simuladoId: simulado.id,
      answers,
      flagged,
      eliminatedOptions,
      startedAt,
      elapsedSeconds,
      isTimerActive: isTimerEnabled,
      currentQuestionIndex: currentIndex,
      isFinished: false,
    };
    saveCurrentSession(session);
  }, [answers, flagged, eliminatedOptions, currentIndex, elapsedSeconds, isTimerEnabled, simulado.id, startedAt]);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const toggleEliminate = (e: React.MouseEvent, optId: string) => {
    e.stopPropagation();
    setEliminatedOptions((prev) => {
      const currentList = prev[currentQ.id] || [];
      if (currentList.includes(optId)) {
        return {
          ...prev,
          [currentQ.id]: currentList.filter((item) => item !== optId),
        };
      } else {
        return {
          ...prev,
          [currentQ.id]: [...currentList, optId],
        };
      }
    });
  };

  const handleFinishConfirmed = () => {
    const finalSession: SimuladoSession = {
      simuladoId: simulado.id,
      answers,
      flagged,
      eliminatedOptions,
      startedAt: initialSession?.startedAt || Date.now(),
      elapsedSeconds,
      isTimerActive: isTimerEnabled,
      currentQuestionIndex: currentIndex,
      isFinished: true,
    };
    setShowConfirmFinishModal(false);
    onFinish(finalSession);
  };

  const currentAnswer = answers[currentQ.id];
  const currentEliminated = eliminatedOptions[currentQ.id] || [];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Sticky Top Bar for Exam Mode */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Exit & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onExit}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Voltar para a lista e salvar rascunho"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">
                  DRIK TREINO
                </span>
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  {simulado.gradeLabel} · {simulado.discipline}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                {simulado.title}
              </h1>
            </div>
          </div>

          {/* Right: Timer & Finish Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Optional Timer */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <button
                onClick={() => setIsTimerEnabled(!isTimerEnabled)}
                className={`p-1 rounded-md text-xs font-semibold cursor-pointer ${
                  isTimerEnabled ? 'text-amber-700 hover:bg-amber-100' : 'text-slate-400 hover:bg-slate-200'
                }`}
                title={isTimerEnabled ? 'Desativar cronômetro' : 'Ativar cronômetro'}
              >
                {isTimerEnabled ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {isTimerEnabled && (
                <>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 tabular-nums">
                    {formatTime(elapsedSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                    title={isTimerRunning ? 'Pausar tempo' : 'Retomar tempo'}
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </>
              )}
            </div>

            {/* Quick Tools */}
            <button
              onClick={() => setShowScratchpad(true)}
              className="p-2 text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer hidden md:flex items-center gap-1 text-xs font-bold"
              title="Abrir rascunho de cálculos"
            >
              <FileEdit className="w-4 h-4 text-pink-500" />
              <span>Rascunho</span>
            </button>

            <button
              onClick={() => setShowFormulaSheet(true)}
              className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer hidden md:flex items-center gap-1 text-xs font-bold"
              title="Guia rápido de fórmulas"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Fórmulas</span>
            </button>

            {/* Finalizar Simulado Button */}
            <button
              onClick={() => setShowConfirmFinishModal(true)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Finalizar Simulado
            </button>
          </div>
        </div>

        {/* Progress Bar under header */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Runner Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Question Card & Answers */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between">
            
            {/* Question Meta Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    Questão {currentIndex + 1} de {totalQuestions}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-pink-600">
                    {currentQ.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Flag / Dúvida button */}
                  <button
                    onClick={toggleFlag}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      flagged[currentQ.id]
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-500 text-amber-600' : ''}`} />
                    <span>{flagged[currentQ.id] ? 'Marcada para Revisão' : 'Dúvida?'}</span>
                  </button>

                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    Fonte: {currentQ.source}
                  </span>
                </div>
              </div>

              {/* Context text or quote if present */}
              {currentQ.contextText && (
                <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5 sm:p-4 mb-4 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  {currentQ.contextText}
                </div>
              )}

              {/* Question Statement */}
              <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-6">
                {currentQ.text}
              </div>

              {/* Multiple Choice Options (A, B, C, D, E) */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = currentAnswer === opt.id;
                  const isEliminated = currentEliminated.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !isEliminated && handleSelectOption(opt.id)}
                      className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer group select-none ${
                        isEliminated
                          ? 'opacity-40 bg-slate-50 border-slate-200 line-through'
                          : isSelected
                          ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-400/20 shadow-xs'
                          : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 pr-2">
                        {/* Option Circle (A, B, C, D, E) styled in Studio Stitch Yellow / Pink */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-900'
                          }`}
                        >
                          {opt.id}
                        </div>

                        {/* Option Text */}
                        <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                          {opt.text}
                        </span>
                      </div>

                      {/* Tool to eliminate option (riscar alternativa) */}
                      <button
                        type="button"
                        onClick={(e) => toggleEliminate(e, opt.id)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-opacity ${
                          isEliminated
                            ? 'text-pink-600 bg-pink-100'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-60 group-hover:opacity-100'
                        }`}
                        title={isEliminated ? 'Restaurar alternativa' : 'Riscar alternativa (estratégia de prova)'}
                      >
                        {isEliminated ? 'Desriscar' : 'Riscar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="text-xs font-semibold text-slate-500 hidden sm:block">
                {answeredCount} de {totalQuestions} respondidas
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmFinishModal(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Finalizar Simulado</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Question Grid Palette & Stats */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-800">
                Gabarito de Respostas
              </h3>
              <span className="text-xs font-bold text-pink-600 tabular-nums">
                {answeredCount} / {totalQuestions}
              </span>
            </div>

            {/* Questions Number Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-slate-900 bg-slate-900 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white font-extrabold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {/* Small answer indicator if chosen */}
                    {isAnswered && !isCurrent && (
                      <span className="text-[9px] opacity-90 leading-none">
                        {answers[q.id]}
                      </span>
                    )}

                    {/* Flag badge indicator */}
                    {isFlagged && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-4 mt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-gradient-to-r from-pink-500 to-rose-600" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-slate-900" />
                <span>Atual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-md bg-slate-200" />
                <span>Em branco</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Dúvida</span>
              </div>
            </div>

            {/* Quick Action in drawer */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setShowScratchpad(true)}
                className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer md:hidden"
              >
                <FileEdit className="w-3.5 h-3.5 text-pink-500" />
                <span>Abrir Rascunho</span>
              </button>

              <button
                onClick={() => setShowConfirmFinishModal(true)}
                className="w-full py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Entregar Prova</span>
              </button>
            </div>

          </div>

          {/* DRIK Motivation Box */}
          <div className="bg-gradient-to-br from-amber-50 to-pink-50 rounded-2xl border border-amber-200/70 p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Dica DRIK de Prova</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Mantenha a calma. Comece pelas questões com textos mais curtos e cálculos diretos. Se travar, use o botão de <strong>Dúvida</strong> e avance!
            </p>
          </div>
        </div>

      </div>

      {/* Modal 1: Confirmation to finish */}
      {showConfirmFinishModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-extrabold text-slate-900">
                Finalizar este simulado?
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Você respondeu <strong>{answeredCount} de {totalQuestions}</strong> questões.
              </p>
              {answeredCount < totalQuestions && (
                <p className="text-xs text-rose-600 font-semibold mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  Atenção: restam {totalQuestions - answeredCount} questão(ões) em branco!
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinishModal(false)}
                className="flex-1 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Voltar e Revisar
              </button>
              <button
                onClick={handleFinishConfirmed}
                className="flex-1 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Sim, Ver Gabarito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Scratchpad (Rascunho) */}
      {showScratchpad && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                <FileEdit className="w-4 h-4 text-pink-600" />
                <span>Rascunho Virtual DRIK</span>
              </div>
              <button
                onClick={() => setShowScratchpad(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Faça contas, anote dados do problema ou monte equações rapidamente:
            </p>

            <textarea
              value={scratchpadText}
              onChange={(e) => setScratchpadText(e.target.value)}
              placeholder="Exemplo de rascunho:
h² + 3² = 5²
h² + 9 = 25
h = √16 = 4..."
              className="w-full h-44 p-3 font-mono text-xs sm:text-sm bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 text-slate-800 resize-none"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => setScratchpadText('')}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
              >
                Limpar rascunho
              </button>
              <button
                onClick={() => setShowScratchpad(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Formula Sheet */}
      {showFormulaSheet && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>Guia Rápido de Fórmulas</span>
              </div>
              <button
                onClick={() => setShowFormulaSheet(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs uppercase text-pink-600">
                  Teorema de Pitágoras
                </strong>
                <p className="font-mono text-sm mt-1">a² = b² + c²</p>
                <span className="text-[11px] text-slate-500">Hipotenusa ao quadrado = soma dos quadrados dos catetos. Triângulo padrão 3-4-5.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs uppercase text-pink-600">
                  Fórmula de Bhaskara
                </strong>
                <p className="font-mono text-sm mt-1">Δ = b² - 4ac &nbsp;|&nbsp; x = (-b ± √Δ) / 2a</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs uppercase text-pink-600">
                  Áreas e Volumes Fundamentais
                </strong>
                <p className="font-mono text-xs mt-1">
                  Retângulo: b × h <br />
                  Círculo: A = π · r² &nbsp;|&nbsp; Comp: C = 2πr <br />
                  Cilindro: V = π · r² · h
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block font-bold text-xs uppercase text-pink-600">
                  Física Básica & Eletricidade
                </strong>
                <p className="font-mono text-xs mt-1">
                  Velocidade Média: Vm = ΔS / Δt <br />
                  Potência Elétrica: P = V · i <br />
                  1ª Lei de Ohm: V = R · i
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowFormulaSheet(false)}
              className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Entendido, voltar à prova
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
