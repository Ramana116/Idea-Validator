import type { AnalysisResult, StartupIdea } from './mockData';

const STORAGE_KEY = 'startup_validator_history';

export interface SavedAnalysis {
  id: string;
  idea: StartupIdea;
  validationScore: number;
  industry: string;
  timestamp: number;
  marketDemand: number;
  successProbability: number;
}

export function saveAnalysis(analysis: AnalysisResult): void {
  try {
    const history = getHistory();
    const saved: SavedAnalysis = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      idea: analysis.idea,
      validationScore: analysis.validationScore,
      industry: analysis.industry.industry,
      timestamp: Date.now(),
      marketDemand: analysis.market.demandScore,
      successProbability: analysis.successProbability,
    };
    
    // Add to beginning, keep max 20 items
    const updated = [saved, ...history].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save analysis:', error);
  }
}

export function getHistory(): SavedAnalysis[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function deleteAnalysis(id: string): void {
  try {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete analysis:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

export function getAnalysisById(id: string): SavedAnalysis | null {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
}

export function exportHistory(): void {
  const history = getHistory();
  const dataStr = JSON.stringify(history, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `startup_validator_history_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
