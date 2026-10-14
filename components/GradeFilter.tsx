'use client';

import React from 'react';
import { GradeLevel, Discipline } from '@/lib/types';
import { Filter, Sparkles, BookOpen } from 'lucide-react';

interface GradeFilterProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  selectedDiscipline: Discipline;
  onSelectDiscipline: (discipline: Discipline) => void;
  totalFilteredCount: number;
}

export function GradeFilter({
  selectedGrade,
  onSelectGrade,
  selectedDiscipline,
  onSelectDiscipline,
  totalFilteredCount,
}: GradeFilterProps) {
  const grades: { id: GradeLevel; label: string; group?: string }[] = [
    { id: 'todos', label: 'Todos os Anos' },
    { id: '6ef', label: '6º EF', group: 'Fundamental' },
    { id: '7ef', label: '7º EF', group: 'Fundamental' },
    { id: '8ef', label: '8º EF', group: 'Fundamental' },
    { id: '9ef', label: '9º EF', group: 'Fundamental' },
    { id: '1em', label: '1º EM', group: 'Médio' },
    { id: '2em', label: '2º EM', group: 'Médio' },
    { id: '3em', label: '3º EM', group: 'Médio' },
  ];

  const disciplines: { id: Discipline; label: string }[] = [
    { id: 'todas', label: 'Todas as Matérias' },
    { id: 'Matemática', label: 'Matemática' },
    { id: 'Língua Portuguesa', label: 'Português' },
    { id: 'Ciências da Natureza', label: 'Ciências / Natureza' },
    { id: 'Raciocínio Lógico', label: 'Raciocínio Lógico (OBMEP)' },
    { id: 'Astronomia e Física', label: 'Astronomia (OBA)' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header of Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-pink-600" />
          <span>Filtro Rápido de Estudos</span>
          <span className="text-xs font-semibold text-slate-500 tabular-nums">
            ({totalFilteredCount} {totalFilteredCount === 1 ? 'disponível' : 'disponíveis'})
          </span>
        </div>

        {(selectedGrade !== 'todos' || selectedDiscipline !== 'todas') && (
          <button
            onClick={() => {
              onSelectGrade('todos');
              onSelectDiscipline('todas');
            }}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 underline self-start sm:self-auto cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {/* Row 1: Grade Selection (6º ao 9º EF e 1º ao 3º EM) */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Ano / Série Escolar:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {grades.map((grade) => {
            const isActive = selectedGrade === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => onSelectGrade(grade.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {grade.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Discipline Filter */}
      <div className="space-y-1.5 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Disciplina / Área do Conhecimento:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {disciplines.map((disc) => {
            const isActive = selectedDiscipline === disc.id;
            return (
              <button
                key={disc.id}
                onClick={() => onSelectDiscipline(disc.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-xs ring-2 ring-pink-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {disc.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
