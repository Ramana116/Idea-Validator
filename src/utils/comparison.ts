// Idea Comparison Tool

import type { AnalysisResult } from './mockData';

export interface ComparisonResult {
  winner: string;
  scores: {
    validation: { idea1: number; idea2: number; winner: number };
    market: { idea1: number; idea2: number; winner: number };
    revenue: { idea1: number; idea2: number; winner: number };
    risk: { idea1: number; idea2: number; winner: number };
    overall: { idea1: number; idea2: number; winner: number };
  };
  insights: string[];
  recommendation: string;
}

export function compareIdeas(analysis1: AnalysisResult, analysis2: AnalysisResult): ComparisonResult {
  const scores = {
    validation: {
      idea1: analysis1.validationScore,
      idea2: analysis2.validationScore,
      winner: 0,
    },
    market: {
      idea1: analysis1.market.demandScore,
      idea2: analysis2.market.demandScore,
      winner: 0,
    },
    revenue: {
      idea1: analysis1.validationBreakdown.revenuePotential,
      idea2: analysis2.validationBreakdown.revenuePotential,
      winner: 0,
    },
    risk: {
      idea1: 100 - (analysis1.risks.filter(r => r.severity === 'High').length * 20),
      idea2: 100 - (analysis2.risks.filter(r => r.severity === 'High').length * 20),
      winner: 0,
    },
    overall: {
      idea1: analysis1.successProbability,
      idea2: analysis2.successProbability,
      winner: 0,
    },
  };

  // Determine winners for each category
  (Object.keys(scores) as Array<keyof typeof scores>).forEach(key => {
    if (scores[key].idea1 > scores[key].idea2) {
      scores[key].winner = 1;
    } else if (scores[key].idea2 > scores[key].idea1) {
      scores[key].winner = 2;
    }
  });

  // Calculate overall scores
  const idea1Total = (scores.validation.idea1 + scores.market.idea1 + scores.revenue.idea1 + scores.risk.idea1 + scores.overall.idea1) / 5;
  const idea2Total = (scores.validation.idea2 + scores.market.idea2 + scores.revenue.idea2 + scores.risk.idea2 + scores.overall.idea2) / 5;

  const insights: string[] = [];

  // Generate insights
  if (Math.abs(scores.validation.idea1 - scores.validation.idea2) < 5) {
    insights.push('Both ideas have similar validation scores - other factors should decide');
  } else {
    insights.push(`${scores.validation.idea1 > scores.validation.idea2 ? analysis1.idea.name : analysis2.idea.name} has stronger validation (${Math.abs(scores.validation.idea1 - scores.validation.idea2)} point difference)`);
  }

  if (scores.market.idea1 > scores.market.idea2 + 10) {
    insights.push(`${analysis1.idea.name} has significantly better market demand`);
  } else if (scores.market.idea2 > scores.market.idea1 + 10) {
    insights.push(`${analysis2.idea.name} has significantly better market demand`);
  }

  const risk1High = analysis1.risks.filter(r => r.severity === 'High').length;
  const risk2High = analysis2.risks.filter(r => r.severity === 'High').length;
  if (risk1High > risk2High) {
    insights.push(`${analysis2.idea.name} has fewer high-severity risks (${risk2High} vs ${risk1High})`);
  } else if (risk2High > risk1High) {
    insights.push(`${analysis1.idea.name} has fewer high-severity risks (${risk1High} vs ${risk2High})`);
  }

  if (analysis1.industry.industry !== analysis2.industry.industry) {
    insights.push(`Different industries: ${analysis1.industry.industry} vs ${analysis2.industry.industry}`);
  }

  const winner = idea1Total > idea2Total ? analysis1.idea.name : analysis2.idea.name;
  const margin = Math.abs(idea1Total - idea2Total).toFixed(1);

  const recommendation = idea1Total > idea2Total
    ? `Recommend pursuing ${analysis1.idea.name} with ${margin}% higher overall score. ${analysis2.idea.name} could be a pivot option if market conditions change.`
    : `Recommend pursuing ${analysis2.idea.name} with ${margin}% higher overall score. ${analysis1.idea.name} could be a pivot option if market conditions change.`;

  if (Math.abs(idea1Total - idea2Total) < 5) {
    insights.push('Scores are very close - consider pursuing both or testing both with customers');
  }

  return {
    winner,
    scores,
    insights,
    recommendation,
  };
}

export function getComparisonMetrics(analysis: AnalysisResult): {
  label: string;
  value: string | number;
  trend: 'positive' | 'negative' | 'neutral';
}[] {
  return [
    {
      label: 'Validation Score',
      value: analysis.validationScore,
      trend: analysis.validationScore >= 80 ? 'positive' : analysis.validationScore >= 60 ? 'neutral' : 'negative',
    },
    {
      label: 'Market Demand',
      value: analysis.market.demandScore,
      trend: analysis.market.demandScore >= 80 ? 'positive' : analysis.market.demandScore >= 60 ? 'neutral' : 'negative',
    },
    {
      label: 'Success Probability',
      value: `${analysis.successProbability}%`,
      trend: analysis.successProbability >= 70 ? 'positive' : analysis.successProbability >= 50 ? 'neutral' : 'negative',
    },
    {
      label: 'Investor Readiness',
      value: `${analysis.investorReadiness}%`,
      trend: analysis.investorReadiness >= 80 ? 'positive' : analysis.investorReadiness >= 60 ? 'neutral' : 'negative',
    },
    {
      label: 'High Risks',
      value: analysis.risks.filter(r => r.severity === 'High').length,
      trend: analysis.risks.filter(r => r.severity === 'High').length <= 1 ? 'positive' : analysis.risks.filter(r => r.severity === 'High').length <= 2 ? 'neutral' : 'negative',
    },
    {
      label: 'Opportunity Gaps',
      value: analysis.gaps.length,
      trend: analysis.gaps.length >= 3 ? 'positive' : analysis.gaps.length >= 2 ? 'neutral' : 'negative',
    },
  ];
}

export function generateComparisonChart(analysis1: AnalysisResult, analysis2: AnalysisResult) {
  return [
    {
      metric: 'Validation',
      [analysis1.idea.name]: analysis1.validationScore,
      [analysis2.idea.name]: analysis2.validationScore,
    },
    {
      metric: 'Market Demand',
      [analysis1.idea.name]: analysis1.market.demandScore,
      [analysis2.idea.name]: analysis2.market.demandScore,
    },
    {
      metric: 'Revenue Potential',
      [analysis1.idea.name]: analysis1.validationBreakdown.revenuePotential,
      [analysis2.idea.name]: analysis2.validationBreakdown.revenuePotential,
    },
    {
      metric: 'Scalability',
      [analysis1.idea.name]: analysis1.validationBreakdown.scalability,
      [analysis2.idea.name]: analysis2.validationBreakdown.scalability,
    },
    {
      metric: 'Innovation',
      [analysis1.idea.name]: analysis1.validationBreakdown.innovation,
      [analysis2.idea.name]: analysis2.validationBreakdown.innovation,
    },
    {
      metric: 'Success Probability',
      [analysis1.idea.name]: analysis1.successProbability,
      [analysis2.idea.name]: analysis2.successProbability,
    },
  ];
}
