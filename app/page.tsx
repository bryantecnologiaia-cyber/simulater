'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SIMULADOS_DATA } from '@/lib/simulados-data';
import {
  Simulado,
  ExamCategory,
  GradeLevel,
  Discipline,
  SimuladoSession,
  SimuladoResult,
} from '@/lib/types';
import {
  getCurrentSession,
  saveResult,
  getResults,
  clearAllResults,
  clearCurrentSession,
} from '@/lib/storage';

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ExamCategories } from '@/components/ExamCategories';
import { GradeFilter } from '@/components/GradeFilter';
import { SimuladoCard } from '@/components/SimuladoCard';
import { SimuladoRunner } from '@/components/SimuladoRunner';
import { GabaritoView } from '@/components/GabaritoView';
import { CustomExamGenerator } from '@/components/CustomExamGenerator';
import { HistoryModal } from '@/components/HistoryModal';
import { AboutModal } from '@/components/AboutModal';

import { Sparkles, BookOpen, Search, Layers, Award } from 'lucide-react';

export default function HomePage() {
  // Navigation / View modes: 'home' | 'runner' | 'gabarito'
  const [viewMode, setViewMode] = useState<'home' | 'runner' | 'gabarito'>('home');
  const [activeSimulado, setActiveSimulado] = useState<Simulado | null>(null);
  const [activeSession, setActiveSession] = useState<SimuladoSession | null>(null);
  const [activeResult, setActiveResult] = useState<SimuladoResult | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('todos');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('todos');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Stored results and drafts in localStorage with lazy initializers
  const [storedResults, setStoredResults] = useState<SimuladoResult[]>(() => {
    return getResults();
  });

  const [savedSessionsMap, setSavedSessionsMap] = useState<Record<string, SimuladoSession | null>>(() => {
    const draftMap: Record<string, SimuladoSession | null> = {};
    SIMULADOS_DATA.forEach((s) => {
      const draft = getCurrentSession(s.id);
      if (draft && !draft.isFinished && Object.keys(draft.answers).length > 0) {
        draftMap[s.id] = draft;
      } else {
        draftMap[s.id] = null;
      }
    });
    return draftMap;
  });

  const refreshLocalData = () => {
    const hist = getResults();
    setStoredResults(hist);

    const draftMap: Record<string, SimuladoSession | null> = {};
    SIMULADOS_DATA.forEach((s) => {
      const draft = getCurrentSession(s.id);
      if (draft && !draft.isFinished && Object.keys(draft.answers).length > 0) {
        draftMap[s.id] = draft;
      } else {
        draftMap[s.id] = null;
      }
    });
    setSavedSessionsMap(draftMap);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ExamCategory, number> = {
      todos: SIMULADOS_DATA.length,
      'prova-paulista': 0,
      saresp: 0,
      enem: 0,
      obmep: 0,
      oba: 0,
      'provas-estaduais': 0,
    };
    SIMULADOS_DATA.forEach((s) => {
      if (counts[s.category] !== undefined) {
        counts[s.category]++;
      }
    });
    return counts;
  }, []);

  // Filtered simulados list
  const filteredSimulados = useMemo(() => {
    return SIMULADOS_DATA.filter((s) => {
      // Category filter
      if (selectedCategory !== 'todos' && s.category !== selectedCategory) {
        return false;
      }
      // Grade filter
      if (selectedGrade !== 'todos' && s.gradeLevel !== selectedGrade) {
        return false;
      }
      // Discipline filter
      if (selectedDiscipline !== 'todas' && s.discipline !== selectedDiscipline) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesCategory = s.categoryName.toLowerCase().includes(query);
        const matchesDesc = s.description.toLowerCase().includes(query);
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDiscipline = s.discipline.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesTags && !matchesDiscipline) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedGrade, selectedDiscipline, searchQuery]);

  // Handle starting a test
  const handleStartSimulado = (simulado: Simulado, resume = false) => {
    setActiveSimulado(simulado);
    if (resume) {
      const draft = getCurrentSession(simulado.id);
      setActiveSession(draft);
    } else {
      clearCurrentSession(simulado.id);
      setActiveSession(null);
    }
    setViewMode('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle finishing test & generating instant Gabarito
  const handleFinishSimulado = (session: SimuladoSession) => {
    if (!activeSimulado) return;

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    activeSimulado.questions.forEach((q) => {
      const ans = session.answers[q.id];
      if (!ans) {
        skippedCount++;
        incorrectCount++;
      } else if (ans === q.correctOption) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / activeSimulado.questions.length) * 100);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const result: SimuladoResult = {
      id: `res-${Date.now()}`,
      simuladoId: activeSimulado.id,
      title: activeSimulado.title,
      categoryName: activeSimulado.categoryName,
      gradeLabel: activeSimulado.gradeLabel,
      discipline: activeSimulado.discipline,
      totalQuestions: activeSimulado.questions.length,
      correctCount,
      incorrectCount,
      skippedCount,
      scorePercentage,
      elapsedSeconds: session.elapsedSeconds,
      completedAt: formattedDate,
      answers: session.answers,
      questions: activeSimulado.questions,
    };

    saveResult(result);
    setActiveResult(result);
    setViewMode('gabarito');
    refreshLocalData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retry mistakes mode: rebuild a mini-test containing only the questions missed!
  const handleRetryMistakes = () => {
    if (!activeResult) return;
    const missedQuestions = activeResult.questions.filter((q) => {
      const userAns = activeResult.answers[q.id];
      return userAns !== q.correctOption;
    });

    if (missedQuestions.length === 0) return;

    const retrySimulado: Simulado = {
      id: `retry-mistakes-${Date.now()}`,
      title: `DRIK - Revisão de Erros | ${activeResult.title}`,
      shortTitle: 'Revisão de Erros DRIK',
      category: 'prova-paulista',
      categoryName: activeResult.categoryName,
      gradeLevel: 'todos',
      gradeLabel: activeResult.gradeLabel,
      discipline: activeResult.discipline as any,
      questionCount: missedQuestions.length,
      estimatedMinutes: Math.ceil(missedQuestions.length * 2.5),
      description: `Refaça apenas as ${missedQuestions.length} questões que você errou ou deixou em branco na tentativa anterior para garantir aprendizado total.`,
      tags: ['Revisão Focada', 'Superação de Erros'],
      questions: missedQuestions.map((q, idx) => ({ ...q, id: idx + 1 })),
    };

    setActiveSimulado(retrySimulado);
    setActiveSession(null);
    setViewMode('runner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all local records
  const handleClearHistory = () => {
    clearAllResults();
    setStoredResults([]);
    refreshLocalData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Global Header (shown in home and gabarito view) */}
      {viewMode !== 'runner' && (
        <Header
          onGoHome={() => setViewMode('home')}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onSearchFocus={() => {}}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setViewMode('home');
          }}
        />
      )}

      {/* VIEW 1: Home Dashboard */}
      {viewMode === 'home' && (
        <main className="flex-1 space-y-10 pb-16">
          {/* Main Hero Banner with Studio Stitch Warm Yellow & Vivid Pink */}
          <Hero
            onStartPopular={() => {
              const firstSim = SIMULADOS_DATA[0];
              if (firstSim) handleStartSimulado(firstSim);
            }}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Interactive Category Cards (Prova Paulista, SARESP, ENEM, OBMEP, OBA, etc.) */}
            <ExamCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
            />

            {/* Quick Filter: Grade & Discipline */}
            <GradeFilter
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
              selectedDiscipline={selectedDiscipline}
              onSelectDiscipline={setSelectedDiscipline}
              totalFilteredCount={filteredSimulados.length}
            />

            {/* Simulados Grid */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Simulados Disponíveis
                  </h2>
                  <p className="text-sm text-slate-500">
                    Acesso 100% livre · Clique para começar a responder imediatamente
                  </p>
                </div>

                {searchQuery && (
                  <div className="text-xs font-semibold text-slate-500">
                    Filtrando por: &quot;<strong className="text-slate-800">{searchQuery}</strong>&quot;{' '}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-pink-600 underline cursor-pointer ml-1"
                    >
                      Limpar busca
                    </button>
                  </div>
                )}
              </div>

              {filteredSimulados.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Nenhum simulado encontrado com os filtros atuais
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    Tente selecionar &quot;Todos os Anos&quot; ou limpar a busca por texto para encontrar mais opções.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('todos');
                      setSelectedGrade('todos');
                      setSelectedDiscipline('todas');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Restaurar todos os simulados
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredSimulados.map((simulado) => {
                    const savedDraft = savedSessionsMap[simulado.id] || null;
                    const lastResult = storedResults.find((r) => r.simuladoId === simulado.id) || null;

                    return (
                      <SimuladoCard
                        key={simulado.id}
                        simulado={simulado}
                        savedSession={savedDraft}
                        lastResult={lastResult}
                        onStart={(sim, resume) => handleStartSimulado(sim, resume)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* Custom Generator Teaser Banner */}
            <section className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Módulo DRIK Inteligente</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Quer um treino com quantidade e matérias personalizadas?
                </h3>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  Use o Gerador DRIK para selecionar seu ano escolar, as disciplinas prioritárias e a quantidade de questões. O simulado começa instantaneamente.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsGeneratorOpen(true)}
                    className="px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-900 bg-white hover:bg-amber-100 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Abrir Gerador de Simulado DRIK
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      )}

      {/* VIEW 2: Simulado Runner (Exam Mode) */}
      {viewMode === 'runner' && activeSimulado && (
        <SimuladoRunner
          simulado={activeSimulado}
          initialSession={activeSession}
          onFinish={handleFinishSimulado}
          onExit={() => {
            refreshLocalData();
            setViewMode('home');
          }}
        />
      )}

      {/* VIEW 3: Gabarito & Instant Results Screen */}
      {viewMode === 'gabarito' && activeResult && (
        <main className="flex-1 pb-16">
          <GabaritoView
            result={activeResult}
            onRetry={() => {
              if (activeSimulado) {
                handleStartSimulado(activeSimulado, false);
              }
            }}
            onRetryMistakes={handleRetryMistakes}
            onChooseAnother={() => setViewMode('home')}
          />
        </main>
      )}

      {/* Footer (shown in home and gabarito mode) */}
      {viewMode !== 'runner' && (
        <footer className="bg-white border-t border-slate-200 mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">
                ESCSIMULADOS
              </span>
              <span className="text-pink-600 font-bold">por DRIK</span>
              <span>·</span>
              <span>100% Gratuito e Livre</span>
            </div>

            <div className="flex items-center gap-4 font-medium">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="hover:text-pink-600 cursor-pointer"
              >
                Sobre o Projeto
              </button>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="hover:text-pink-600 cursor-pointer"
              >
                Histórico de Simulados
              </button>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="hover:text-pink-600 cursor-pointer"
              >
                Gerador DRIK
              </button>
            </div>

            <div>
              Design System Studio Stitch · Sem necessidade de cadastro
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <CustomExamGenerator
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onStartCustom={(customSim) => handleStartSimulado(customSim, false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        results={storedResults}
        onSelectResult={(res) => {
          setActiveResult(res);
          const original = SIMULADOS_DATA.find((s) => s.id === res.simuladoId);
          if (original) setActiveSimulado(original);
          setViewMode('gabarito');
        }}
        onClearHistory={handleClearHistory}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
}
