'use client';

import React, { useState } from 'react';
import { Simulado, ExamCategory, GradeLevel, Discipline } from '@/lib/types';
import { SIMULADOS_DATA } from '@/lib/simulados-data';
import { Sparkles, X, BookOpen, Layers, Check, ArrowRight } from 'lucide-react';

interface CustomExamGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustom: (simulado: Simulado) => void;
}

export function CustomExamGenerator({
  isOpen,
  onClose,
  onStartCustom,
}: CustomExamGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('todos');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('todos');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>('todas');
  const [questionCount, setQuestionCount] = useState<number>(5);

  if (!isOpen) return null;

  const handleGenerate = () => {
    // Collect all matching questions from SIMULADOS_DATA
    let candidatePool = SIMULADOS_DATA.flatMap((s) => {
      // Check category match
      if (selectedCategory !== 'todos' && s.category !== selectedCategory) return [];
      // Check grade match
      if (selectedGrade !== 'todos' && s.gradeLevel !== selectedGrade) return [];
      // Check discipline match
      if (selectedDiscipline !== 'todas' && s.discipline !== selectedDiscipline) return [];
      return s.questions;
    });

    // Fallback if filter is too narrow
    if (candidatePool.length === 0) {
      candidatePool = SIMULADOS_DATA.flatMap((s) => s.questions);
    }

    // Shuffle questions
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    // Re-index question IDs for continuous numbering
    const formattedQuestions = selectedQuestions.map((q, idx) => ({
      ...q,
      id: idx + 1,
    }));

    const customSimulado: Simulado = {
      id: `custom-${Date.now()}`,
      title: `DRIK - Simulado Personalizado | ${
        selectedDiscipline !== 'todas' ? selectedDiscipline : 'Multidisciplinar'
      }`,
      shortTitle: 'Simulado DRIK Personalizado',
      category: selectedCategory === 'todos' ? 'prova-paulista' : selectedCategory,
      categoryName: selectedCategory === 'todos' ? 'Simulado Misto' : selectedCategory.toUpperCase(),
      gradeLevel: selectedGrade,
      gradeLabel: selectedGrade === 'todos' ? 'Nível Adaptativo' : selectedGrade.toUpperCase(),
      discipline: selectedDiscipline,
      questionCount: formattedQuestions.length,
      estimatedMinutes: Math.ceil(formattedQuestions.length * 2.5),
      description: `Treino personalizado gerado sob medida pelo módulo DRIK com ${formattedQuestions.length} questões com gabarito comentado.`,
      tags: ['Personalizado', 'Módulo DRIK', 'Prática Rápida'],
      questions: formattedQuestions,
    };

    onClose();
    onStartCustom(customSimulado);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Gerador de Simulado DRIK
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">
                  Gratuito
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Monte um treino sob medida com as matérias e provas que você quer focar
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

        {/* Section 1: Exam Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            1. Tipo de Avaliação / Exame:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'todos', label: 'Misto / Todas' },
              { id: 'prova-paulista', label: 'Prova Paulista' },
              { id: 'saresp', label: 'SARESP' },
              { id: 'enem', label: 'ENEM' },
              { id: 'obmep', label: 'OBMEP' },
              { id: 'oba', label: 'OBA' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCategory(item.id as ExamCategory)}
                className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                  selectedCategory === item.id
                    ? 'border-pink-500 bg-pink-50 text-pink-900 ring-2 ring-pink-400/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Grade */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            2. Ano Escolar:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'todos', label: 'Qualquer Nível' },
              { id: '6ef', label: '6º EF' },
              { id: '7ef', label: '7º EF' },
              { id: '8ef', label: '8º EF' },
              { id: '9ef', label: '9º EF' },
              { id: '1em', label: '1º EM' },
              { id: '2em', label: '2º EM' },
              { id: '3em', label: '3º EM' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGrade(g.id as GradeLevel)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedGrade === g.id
                    ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Discipline */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            3. Disciplina:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'todas', label: 'Todas as Matérias' },
              { id: 'Matemática', label: 'Matemática' },
              { id: 'Língua Portuguesa', label: 'Português' },
              { id: 'Ciências da Natureza', label: 'Ciências' },
              { id: 'Raciocínio Lógico', label: 'Lógica (OBMEP)' },
              { id: 'Astronomia e Física', label: 'Astronomia (OBA)' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiscipline(d.id as Discipline)}
                className={`p-2 rounded-lg text-xs font-bold border text-left transition-all cursor-pointer ${
                  selectedDiscipline === d.id
                    ? 'border-pink-500 bg-pink-50 text-pink-900 ring-1 ring-pink-400/40'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Question Count */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            4. Quantidade de Questões no Simulado:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 8, 10, 15].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setQuestionCount(cnt)}
                className={`py-2 rounded-xl text-center text-xs font-extrabold border transition-all cursor-pointer ${
                  questionCount === cnt
                    ? 'border-amber-400 bg-amber-400 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cnt} Questões
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            className="w-full py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Gerar e Iniciar Simulado Imediatamente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            Sem cadastro ou espera. As questões são sorteadas e o cronômetro começa imediatamente.
          </p>
        </div>

      </div>
    </div>
  );
}
