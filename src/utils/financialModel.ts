// Advanced Financial Modeling Engine

export interface FinancialInputs {
  monthlySubPrice: number;
  targetCustomers: number;
  conversionRate: number;
  churnRate: number;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  fixedCosts: number; // Monthly fixed costs
  variableCostPerUser: number;
  initialFunding: number;
  teamSize: number;
  avgSalary: number;
}

export interface FinancialMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  grossMargin: number;
  burnRate: number;
  runway: number; // Months until cash runs out
  breakEvenMonth: number;
  ltvCacRatio: number;
  paybackPeriod: number; // Months to recover CAC
  quickRatio: number;
  churnAdjustedGrowth: number;
}

export interface Projection {
  month: number;
  customers: number;
  mrr: number;
  expenses: number;
  profit: number;
  cashBalance: number;
  cumulativeCashBurn: number;
}

export interface SensitivityScenario {
  name: string;
  conversionRate: number;
  churnRate: number;
  cac: number;
  breakEvenMonth: number;
  runway: number;
  ltvCacRatio: number;
}

export function calculateFinancialMetrics(inputs: FinancialInputs): FinancialMetrics {
  const { monthlySubPrice, targetCustomers, conversionRate, churnRate, cac, ltv, fixedCosts, variableCostPerUser, initialFunding, teamSize, avgSalary } = inputs;

  const customers = targetCustomers * conversionRate;
  const mrr = customers * monthlySubPrice;
  const arr = mrr * 12;
  
  const revenue = mrr;
  const variableCosts = customers * variableCostPerUser;
  const salaryCosts = teamSize * avgSalary;
  const totalExpenses = fixedCosts + variableCosts + salaryCosts;
  
  const grossMargin = ((revenue - variableCosts) / revenue) * 100;
  const burnRate = totalExpenses - revenue;
  const runway = burnRate > 0 ? initialFunding / burnRate : 999;
  
  const ltvCacRatio = ltv / cac;
  const paybackPeriod = cac / (monthlySubPrice * (1 - churnRate));
  
  const newCustomers = customers * 0.15; // 15% monthly growth assumption
  const lostCustomers = customers * churnRate;
  const churnAdjustedGrowth = ((newCustomers - lostCustomers) / customers) * 100;
  
  const quickRatio = (newCustomers * monthlySubPrice) / (lostCustomers * monthlySubPrice + burnRate);
  
  // Break-even calculation
  const contributionMargin = monthlySubPrice - variableCostPerUser;
  const breakEvenCustomers = fixedCosts / contributionMargin;
  const breakEvenMonth = breakEvenCustomers > customers 
    ? Math.log(breakEvenCustomers / customers) / Math.log(1 + 0.15) 
    : 0;

  return {
    mrr: Math.round(mrr),
    arr: Math.round(arr),
    grossMargin: Math.round(grossMargin),
    burnRate: Math.round(burnRate),
    runway: Math.round(runway),
    breakEvenMonth: Math.round(Math.max(0, breakEvenMonth)),
    ltvCacRatio: parseFloat(ltvCacRatio.toFixed(2)),
    paybackPeriod: Math.round(Math.max(0, paybackPeriod)),
    quickRatio: parseFloat(quickRatio.toFixed(2)),
    churnAdjustedGrowth: parseFloat(churnAdjustedGrowth.toFixed(2)),
  };
}

export function generateProjections(inputs: FinancialInputs, months: number = 36): Projection[] {
  const projections: Projection[] = [];
  let customers = inputs.targetCustomers * inputs.conversionRate;
  let cashBalance = inputs.initialFunding;
  let cumulativeBurn = 0;

  for (let month = 1; month <= months; month++) {
    const mrr = customers * inputs.monthlySubPrice;
    const variableCosts = customers * inputs.variableCostPerUser;
    const salaryCosts = inputs.teamSize * inputs.avgSalary * (1 + month * 0.02); // 2% monthly salary growth
    const totalExpenses = inputs.fixedCosts + variableCosts + salaryCosts;
    const profit = mrr - totalExpenses;
    
    cashBalance += profit;
    if (profit < 0) cumulativeBurn += Math.abs(profit);
    
    // Customer growth with churn
    const newCustomers = customers * 0.15 * (1 - month / 60); // Growth slows over time
    const lostCustomers = customers * inputs.churnRate;
    customers = Math.max(0, customers + newCustomers - lostCustomers);

    projections.push({
      month,
      customers: Math.round(customers),
      mrr: Math.round(mrr),
      expenses: Math.round(totalExpenses),
      profit: Math.round(profit),
      cashBalance: Math.round(cashBalance),
      cumulativeCashBurn: Math.round(cumulativeBurn),
    });

    if (cashBalance <= 0 && month > 12) break; // Stop if runway ends
  }

  return projections;
}

export function runSensitivityAnalysis(inputs: FinancialInputs): SensitivityScenario[] {
  const scenarios: SensitivityScenario[] = [];
  
  const baseMetrics = calculateFinancialMetrics(inputs);
  
  // Base case
  scenarios.push({
    name: 'Base Case',
    conversionRate: inputs.conversionRate,
    churnRate: inputs.churnRate,
    cac: inputs.cac,
    breakEvenMonth: baseMetrics.breakEvenMonth,
    runway: baseMetrics.runway,
    ltvCacRatio: baseMetrics.ltvCacRatio,
  });

  // Optimistic
  const optimisticInputs = {
    ...inputs,
    conversionRate: inputs.conversionRate * 1.5,
    churnRate: inputs.churnRate * 0.7,
    cac: inputs.cac * 0.8,
  };
  const optimisticMetrics = calculateFinancialMetrics(optimisticInputs);
  scenarios.push({
    name: 'Optimistic',
    conversionRate: optimisticInputs.conversionRate,
    churnRate: optimisticInputs.churnRate,
    cac: optimisticInputs.cac,
    breakEvenMonth: optimisticMetrics.breakEvenMonth,
    runway: optimisticMetrics.runway,
    ltvCacRatio: optimisticMetrics.ltvCacRatio,
  });

  // Pessimistic
  const pessimisticInputs = {
    ...inputs,
    conversionRate: inputs.conversionRate * 0.5,
    churnRate: inputs.churnRate * 1.5,
    cac: inputs.cac * 1.3,
  };
  const pessimisticMetrics = calculateFinancialMetrics(pessimisticInputs);
  scenarios.push({
    name: 'Pessimistic',
    conversionRate: pessimisticInputs.conversionRate,
    churnRate: pessimisticInputs.churnRate,
    cac: pessimisticInputs.cac,
    breakEvenMonth: pessimisticMetrics.breakEvenMonth,
    runway: pessimisticMetrics.runway,
    ltvCacRatio: pessimisticMetrics.ltvCacRatio,
  });

  return scenarios;
}

export function calculateValuation(metrics: FinancialMetrics, industry: string): {
  preMoney: number;
  postMoney: number;
  methodology: string;
  comparables: { name: string; multiple: string }[];
} {
  const industryMultiples: Record<string, number> = {
    'EdTech': 8,
    'FinTech': 12,
    'HealthTech': 10,
    'E-Commerce': 5,
    'SaaS': 10,
    'default': 7,
  };

  const multiple = industryMultiples[industry] || industryMultiples.default;
  const preMoney = metrics.arr * multiple;
  const raiseAmount = preMoney * 0.25; // Typical 20-25% dilution
  const postMoney = preMoney + raiseAmount;

  return {
    preMoney: Math.round(preMoney),
    postMoney: Math.round(postMoney),
    methodology: `${multiple}x ARR multiple based on ${industry} benchmarks`,
    comparables: [
      { name: 'Similar EdTech Startup', multiple: `${multiple - 2}x ARR` },
      { name: 'Market Leader', multiple: `${multiple + 3}x ARR` },
      { name: 'Early Stage Avg', multiple: `${multiple - 1}x ARR` },
    ],
  };
}

export function generateCapTable(
  founders: number,
  employeePool: number,
  raiseAmount: number,
  preMoney: number
): {
  party: string;
  shares: number;
  percentage: number;
  value: number;
}[] {
  const postMoney = preMoney + raiseAmount;
  const investorPercentage = (raiseAmount / postMoney) * 100;
  const remainingPercentage = 100 - investorPercentage - employeePool;
  const founderPercentage = remainingPercentage / founders;

  const totalShares = 10000000;
  const pricePerShare = preMoney / totalShares;

  return [
    ...Array(founders).fill(0).map((_, i) => ({
      party: `Founder ${i + 1}`,
      shares: Math.round(totalShares * (founderPercentage / 100)),
      percentage: parseFloat(founderPercentage.toFixed(2)),
      value: Math.round(totalShares * (founderPercentage / 100) * pricePerShare),
    })),
    {
      party: 'Employee Pool',
      shares: Math.round(totalShares * (employeePool / 100)),
      percentage: employeePool,
      value: Math.round(totalShares * (employeePool / 100) * pricePerShare),
    },
    {
      party: 'Investors',
      shares: Math.round(totalShares * (investorPercentage / 100)),
      percentage: parseFloat(investorPercentage.toFixed(2)),
      value: Math.round(totalShares * (investorPercentage / 100) * pricePerShare),
    },
  ];
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return `₹${amount}`;
}

export function getHealthScore(metrics: FinancialMetrics): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  insights: string[];
} {
  let score = 0;
  const insights: string[] = [];

  // LTV:CAC Ratio (max 25 points)
  if (metrics.ltvCacRatio >= 3) {
    score += 25;
    insights.push('✅ Excellent LTV:CAC ratio (>3:1)');
  } else if (metrics.ltvCacRatio >= 2) {
    score += 18;
    insights.push('⚠️ Good LTV:CAC ratio, room for improvement');
  } else {
    score += 8;
    insights.push('❌ Low LTV:CAC ratio - reduce CAC or increase LTV');
  }

  // Runway (max 25 points)
  if (metrics.runway >= 18) {
    score += 25;
    insights.push('✅ Strong runway (>18 months)');
  } else if (metrics.runway >= 12) {
    score += 18;
    insights.push('⚠️ Adequate runway, plan next raise');
  } else {
    score += 8;
    insights.push('❌ Low runway - raise funds or reduce burn');
  }

  // Gross Margin (max 20 points)
  if (metrics.grossMargin >= 80) {
    score += 20;
    insights.push('✅ Excellent gross margins');
  } else if (metrics.grossMargin >= 60) {
    score += 14;
    insights.push('⚠️ Good margins for SaaS');
  } else {
    score += 6;
    insights.push('❌ Low margins - review pricing/costs');
  }

  // Growth (max 15 points)
  if (metrics.churnAdjustedGrowth >= 10) {
    score += 15;
    insights.push('✅ Strong growth trajectory');
  } else if (metrics.churnAdjustedGrowth >= 5) {
    score += 10;
    insights.push('⚠️ Moderate growth');
  } else {
    score += 4;
    insights.push('❌ Growth concerns - address churn');
  }

  // Payback Period (max 15 points)
  if (metrics.paybackPeriod <= 6) {
    score += 15;
    insights.push('✅ Fast CAC payback (<6 months)');
  } else if (metrics.paybackPeriod <= 12) {
    score += 10;
    insights.push('⚠️ Acceptable payback period');
  } else {
    score += 4;
    insights.push('❌ Slow CAC recovery');
  }

  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 55) grade = 'C';
  else if (score >= 40) grade = 'D';

  return { score, grade, insights };
}
