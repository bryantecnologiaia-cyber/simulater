import { SimuladoSession, SimuladoResult } from './types';

const SESSION_PREFIX = 'escsimulados_session_';
const RESULTS_KEY = 'escsimulados_history_results';

export function saveCurrentSession(session: SimuladoSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${SESSION_PREFIX}${session.simuladoId}`, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving session to localStorage', e);
  }
}

export function getCurrentSession(simuladoId: string): SimuladoSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${SESSION_PREFIX}${simuladoId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SimuladoSession;
  } catch (e) {
    console.error('Error loading session from localStorage', e);
    return null;
  }
}

export function clearCurrentSession(simuladoId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${SESSION_PREFIX}${simuladoId}`);
  } catch (e) {
    console.error('Error clearing session', e);
  }
}

export function saveResult(result: SimuladoResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getResults();
    const updated = [result, ...existing.filter((r) => r.id !== result.id)].slice(0, 30);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving result to history', e);
  }
}

export function getResults(): SimuladoResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SimuladoResult[];
  } catch (e) {
    console.error('Error loading results', e);
    return [];
  }
}

export function clearAllResults(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RESULTS_KEY);
  } catch (e) {
    console.error('Error clearing history', e);
  }
}
