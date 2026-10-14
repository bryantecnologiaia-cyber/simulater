'use client';

import React from 'react';
import { ExamCategory } from '@/lib/types';
import { GraduationCap, Award, Compass, Calculator, BookOpen, Layers } from 'lucide-react';

interface ExamCategoriesProps {
  selectedCategory: ExamCategory;
  onSelectCategory: (category: ExamCategory) => void;
  categoryCounts: Record<ExamCategory, number>;
}

interface CategoryCardItem {
  id: ExamCategory;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

export function ExamCategories({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: ExamCategoriesProps) {
  const categories: CategoryCardItem[] = [
    {
      id: 'prova-paulista',
      title: 'Prova Paulista',
      subtitle: 'Rede Estadual SP · 6º ao 9º EF & 1º ao 3º EM',
      badge: 'Oficial SEDUC-SP',
      icon: <GraduationCap className="w-6 h-6 text-pink-600" />,
      bgGradient: 'hover:bg-pink-50/70',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
    },
    {
      id: 'saresp',
      title: 'SARESP',
      subtitle: 'Sistema de Avaliação de SP · Leitura e Matemática',
      badge: 'Foco Habilidades',
      icon: <BookOpen className="w-6 h-6 text-amber-600" />,
      bgGradient: 'hover:bg-amber-50/70',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      id: 'enem',
      title: 'ENEM',
      subtitle: 'Matemática e Ciências da Natureza · Matriz TRI',
      badge: 'Ensino Médio',
      icon: <Award className="w-6 h-6 text-rose-600" />,
      bgGradient: 'hover:bg-rose-50/70',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-700',
    },
    {
      id: 'obmep',
      title: 'OBMEP',
      subtitle: 'Olimpíada Brasileira de Matemática · Níveis 1, 2 e 3',
      badge: 'Raciocínio Lógico',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      bgGradient: 'hover:bg-amber-50/70',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      id: 'oba',
      title: 'OBA',
      subtitle: 'Olimpíada de Astronomia e Astronáutica · MOBFOG',
      badge: 'Ciências & Espaço',
      icon: <Compass className="w-6 h-6 text-pink-600" />,
      bgGradient: 'hover:bg-pink-50/70',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
    },
    {
      id: 'provas-estaduais',
      title: 'Outras Avaliações',
      subtitle: 'SPAECE, SADEAM, SAEB e Prova Brasil',
      badge: 'Avaliações Estaduais',
      icon: <Layers className="w-6 h-6 text-slate-700" />,
      bgGradient: 'hover:bg-slate-100/70',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-800',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Categorias de Provas
          </h2>
          <p className="text-sm text-slate-500">
            Selecione uma avaliação oficial para filtrar os simulados do módulo DRIK
          </p>
        </div>

        {selectedCategory !== 'todos' && (
          <button
            onClick={() => onSelectCategory('todos')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 underline self-start sm:self-auto cursor-pointer"
          >
            Ver todas as provas ({categoryCounts['todos'] || 0})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? 'todos' : cat.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/50 shadow-sm ring-2 ring-pink-400/20'
                  : `border-slate-200/90 bg-white ${cat.bgGradient} hover:border-slate-300 hover:shadow-xs`
              }`}
            >
              {/* Active corner mark */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                  <div className="bg-pink-500 rotate-45 w-12 h-4 absolute top-1 right-[-14px]" />
                </div>
              )}

              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-white shadow-xs' : 'bg-slate-50'
                  }`}
                >
                  {cat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-pink-600 transition-colors truncate">
                      {cat.title}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums shrink-0">
                      {count} {count === 1 ? 'simulado' : 'simulados'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span className={`text-[11px] font-bold ${cat.textColor}`}>
                      {cat.badge}
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-700 transition-colors">
                      {isSelected ? 'Filtrado ✓' : 'Explorar →'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
