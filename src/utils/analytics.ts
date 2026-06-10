// Analytics & Progress Tracking

import type { SavedAnalysis } from './storage';
import { getHistory } from './storage';

export interface AnalyticsData {
  totalAnalyses: number;
  averageScore: number;
  scoreDistribution: {
    excellent: number; // 80+
    good: number; // 60-79
    needsWork: number; // <60
  };
  industryBreakdown: Record<string, number>;
  trendData: { date: string; score: number }[];
  bestIdea: SavedAnalysis | null;
  improvementRate: number;
  streakDays: number;
  lastAnalysisDate: string | null;
}

export function calculateAnalytics(): AnalyticsData {
  const history = getHistory();
  
  if (history.length === 0) {
    return {
      totalAnalyses: 0,
      averageScore: 0,
      scoreDistribution: { excellent: 0, good: 0, needsWork: 0 },
      industryBreakdown: {},
      trendData: [],
      bestIdea: null,
      improvementRate: 0,
      streakDays: 0,
      lastAnalysisDate: null,
    };
  }

  // Total analyses
  const totalAnalyses = history.length;

  // Average score
  const averageScore = Math.round(
    history.reduce((sum, h) => sum + h.validationScore, 0) / totalAnalyses
  );

  // Score distribution
  const scoreDistribution = {
    excellent: history.filter(h => h.validationScore >= 80).length,
    good: history.filter(h => h.validationScore >= 60 && h.validationScore < 80).length,
    needsWork: history.filter(h => h.validationScore < 60).length,
  };

  // Industry breakdown
  const industryBreakdown: Record<string, number> = {};
  history.forEach(h => {
    industryBreakdown[h.industry] = (industryBreakdown[h.industry] || 0) + 1;
  });

  // Trend data (last 10 analyses)
  const trendData = history
    .slice(0, 10)
    .reverse()
    .map(h => ({
      date: new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: h.validationScore,
    }));

  // Best idea
  const bestIdea = history.reduce((best, current) => 
    current.validationScore > best.validationScore ? current : best
  , history[0]);

  // Improvement rate (comparing first 5 vs last 5)
  let improvementRate = 0;
  if (history.length >= 10) {
    const firstFive = history.slice(-5).reduce((sum, h) => sum + h.validationScore, 0) / 5;
    const lastFive = history.slice(0, 5).reduce((sum, h) => sum + h.validationScore, 0) / 5;
    improvementRate = Math.round(((lastFive - firstFive) / firstFive) * 100);
  }

  // Streak calculation
  let streakDays = 0;
  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < history.length; i++) {
    const analysisDate = new Date(history[i].timestamp);
    const daysDiff = Math.floor((now.getTime() - analysisDate.getTime()) / oneDayMs);
    
    if (daysDiff <= streakDays + 1) {
      streakDays = daysDiff + 1;
    } else {
      break;
    }
  }

  // Last analysis date
  const lastAnalysisDate = history.length > 0 
    ? new Date(history[0].timestamp).toLocaleDateString()
    : null;

  return {
    totalAnalyses,
    averageScore,
    scoreDistribution,
    industryBreakdown,
    trendData,
    bestIdea,
    improvementRate,
    streakDays,
    lastAnalysisDate,
  };
}

export function getInsights(analytics: AnalyticsData): {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}[] {
  const insights: any[] = [];

  if (analytics.totalAnalyses === 0) {
    insights.push({
      type: 'info' as const,
      title: 'Start Analyzing',
      description: 'Your first analysis will appear here. Try validating a startup idea!',
    });
    return insights;
  }

  // Score insights
  if (analytics.averageScore >= 80) {
    insights.push({
      type: 'success' as const,
      title: 'Strong Ideas',
      description: `Your average validation score is ${analytics.averageScore}. You have a good eye for promising startups!`,
    });
  } else if (analytics.averageScore < 60) {
    insights.push({
      type: 'warning' as const,
      title: 'Keep Iterating',
      description: `Your average score is ${analytics.averageScore}. Try refining ideas or exploring different markets.`,
    });
  }

  // Activity insights
  if (analytics.totalAnalyses >= 10) {
    insights.push({
      type: 'success' as const,
      title: 'Active Validator',
      description: `You've analyzed ${analytics.totalAnalyses} ideas. Consistency is key to finding the right opportunity!`,
    });
  }

  // Improvement insights
  if (analytics.improvementRate > 10) {
    insights.push({
      type: 'success' as const,
      title: 'Improving Fast',
      description: `Your idea quality has improved by ${analytics.improvementRate}% over time. Great progress!`,
    });
  } else if (analytics.improvementRate < -10) {
    insights.push({
      type: 'warning' as const,
      title: 'Focus on Quality',
      description: 'Recent ideas score lower than earlier ones. Take time to validate before committing.',
    });
  }

  // Streak insights
  if (analytics.streakDays >= 7) {
    insights.push({
      type: 'success' as const,
      title: 'On a Streak',
      description: `You've been validating ideas for ${analytics.streakDays} days. Keep the momentum!`,
    });
  }

  // Industry focus
  const topIndustry = Object.entries(analytics.industryBreakdown)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topIndustry && topIndustry[1] >= 3) {
    insights.push({
      type: 'info' as const,
      title: 'Industry Focus',
      description: `You're exploring ${topIndustry[0]} heavily (${topIndustry[1]} ideas). Consider deep expertise in this space.`,
    });
  }

  return insights;
}

export function generateReportCard(analytics: AnalyticsData): {
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  scores: {
    activity: number;
    quality: number;
    improvement: number;
    diversity: number;
  };
  feedback: string;
} {
  // Activity score (0-100)
  const activityScore = Math.min(100, analytics.totalAnalyses * 10);

  // Quality score (0-100)
  const qualityScore = analytics.averageScore;

  // Improvement score (0-100)
  const improvementScore = Math.min(100, Math.max(0, 50 + analytics.improvementRate));

  // Diversity score (0-100)
  const industryCount = Object.keys(analytics.industryBreakdown).length;
  const diversityScore = Math.min(100, industryCount * 20);

  // Overall grade
  const average = (activityScore + qualityScore + improvementScore + diversityScore) / 4;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (average >= 90) grade = 'A';
  else if (average >= 80) grade = 'B';
  else if (average >= 70) grade = 'C';
  else if (average >= 60) grade = 'D';

  // Feedback
  let feedback = '';
  if (grade === 'A') {
    feedback = 'Excellent work! You\'re systematically validating ideas and improving over time. Ready to build something great.';
  } else if (grade === 'B') {
    feedback = 'Strong performance! Keep analyzing ideas and focus on improving your validation process.';
  } else if (grade === 'C') {
    feedback = 'Good start! Try to analyze more ideas and focus on those with higher validation scores.';
  } else if (grade === 'D') {
    feedback = 'Keep going! Validate more ideas and don\'t be afraid to kill weak ones early.';
  } else {
    feedback = 'Start by analyzing your first idea. Every great startup begins with validation.';
  }

  return {
    grade,
    scores: {
      activity: Math.round(activityScore),
      quality: Math.round(qualityScore),
      improvement: Math.round(improvementScore),
      diversity: Math.round(diversityScore),
    },
    feedback,
  };
}

export function getBenchmarkPercentile(analytics: AnalyticsData): number {
  // Simulated percentile based on score and activity
  const basePercentile = analytics.averageScore;
  const activityBonus = Math.min(20, analytics.totalAnalyses * 2);
  const streakBonus = Math.min(10, analytics.streakDays);
  
  return Math.min(99, Math.round(basePercentile * 0.7 + activityBonus + streakBonus));
}

export function exportAnalytics(): void {
  const analytics = calculateAnalytics();
  const reportCard = generateReportCard(analytics);
  const insights = getInsights(analytics);

  const data = {
    generatedAt: new Date().toISOString(),
    analytics,
    reportCard,
    insights,
    benchmarkPercentile: getBenchmarkPercentile(analytics),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `startup_validator_analytics_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
