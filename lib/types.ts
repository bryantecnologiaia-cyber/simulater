export type ExamCategory =
  | 'todos'
  | 'prova-paulista'
  | 'saresp'
  | 'enem'
  | 'obmep'
  | 'oba'
  | 'provas-estaduais';

export type GradeLevel =
  | 'todos'
  | '6ef'
  | '7ef'
  | '8ef'
  | '9ef'
  | '1em'
  | '2em'
  | '3em';

export type Discipline =
  | 'todas'
  | 'Matemática'
  | 'Língua Portuguesa'
  | 'Ciências da Natureza'
  | 'História e Geografia'
  | 'Astronomia e Física'
  | 'Raciocínio Lógico';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
}

export interface Question {
  id: number;
  text: string;
  contextText?: string;
  contextImageUrl?: string;
  options: QuestionOption[];
  correctOption: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  drikTip: string;
  discipline: string;
  topic: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  source: string;
}

export interface Simulado {
  id: string;
  title: string;
  shortTitle: string;
  category: ExamCategory;
  categoryName: string;
  gradeLevel: GradeLevel;
  gradeLabel: string;
  discipline: Discipline;
  questionCount: number;
  estimatedMinutes: number;
  description: string;
  featured?: boolean;
  tags: string[];
  questions: Question[];
}

export interface SimuladoSession {
  simuladoId: string;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  flagged: Record<number, boolean>;
  eliminatedOptions: Record<number, string[]>;
  startedAt: number;
  elapsedSeconds: number;
  isTimerActive: boolean;
  currentQuestionIndex: number;
  isFinished: boolean;
}

export interface SimuladoResult {
  id: string;
  simuladoId: string;
  title: string;
  categoryName: string;
  gradeLabel: string;
  discipline: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  scorePercentage: number;
  elapsedSeconds: number;
  completedAt: string;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | 'E'>;
  questions: Question[];
}
