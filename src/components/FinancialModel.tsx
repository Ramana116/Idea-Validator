import { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, AlertCircle, CheckCircle } from 'lucide-react';
import {
  calculateFinancialMetrics,
  generateProjections,
  runSensitivityAnalysis,
  calculateValuation,
  generateCapTable,
  getHealthScore,
  formatCurrency,
  type FinancialInputs,
} from '../utils/financialModel';
import type { AnalysisResult } from '../utils/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface FinancialModelProps {
  analysis: AnalysisResult;
}

export default function FinancialModel({ analysis }: FinancialModelProps) {
  const [inputs, setInputs] = useState<FinancialInputs>({
    monthlySubPrice: parseInt(analysis.businessModel.pricing.replace(/\D/g, '')) || 299,
    targetCustomers: 10000,
    conversionRate: 0.03,
    churnRate: 0.05,
    cac: 500,
    ltv: 3000,
    fixedCosts: 100000,
    variableCostPerUser: 50,
    initialFunding: 5000000,
    teamSize: 5,
    avgSalary: 80000,
  });

  const metrics = calculateFinancialMetrics(inputs);
  const projections = generateProjections(inputs, 24);
  const sensitivity = runSensitivityAnalysis(inputs);
  const valuation = calculateValuation(metrics, analysis.industry.industry);
  const capTable = generateCapTable(2, 15, valuation.preMoney * 0.25, valuation.preMoney);
  const healthScore = getHealthScore(metrics);

  const updateInput = (key: keyof FinancialInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <PieChart className="w-5 h-5 text-violet-400" />
            Financial Health Score
          </h3>
          <div className={`text-4xl font-black ${
            healthScore.grade === 'A' ? 'text-emerald-400' :
            healthScore.grade === 'B' ? 'text-blue-400' :
            healthScore.grade === 'C' ? 'text-amber-400' :
            healthScore.grade === 'D' ? 'text-orange-400' : 'text-red-400'
          }`}>
            {healthScore.grade}
          </div>
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="relative w-32 h-32">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#1e1b2e" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="56" fill="none"
                stroke={healthScore.score >= 70 ? '#10b981' : healthScore.score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeDasharray={351.86}
                strokeDashoffset={351.86 - (healthScore.score / 100) * 351.86}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{healthScore.score}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {healthScore.insights.map((insight, i) => (
              <div key={i} className="text-sm text-gray-300 flex items-start gap-2">
                {insight.includes('✅') ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : insight.includes('⚠️') ? (
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <span>{insight.replace(/[✅⚠️❌]/g, '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'MRR', value: formatCurrency(metrics.mrr), icon: DollarSign, color: 'text-emerald-400' },
          { label: 'ARR', value: formatCurrency(metrics.arr), icon: TrendingUp, color: 'text-violet-400' },
          { label: 'Gross Margin', value: `${metrics.grossMargin}%`, icon: PieChart, color: 'text-blue-400' },
          { label: 'Burn Rate', value: formatCurrency(metrics.burnRate), icon: AlertCircle, color: metrics.burnRate > 0 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'Runway', value: `${metrics.runway} mo`, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'LTV:CAC', value: `${metrics.ltvCacRatio}:1`, icon: DollarSign, color: metrics.ltvCacRatio >= 3 ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'Payback', value: `${metrics.paybackPeriod} mo`, icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Break-even', value: `Month ${metrics.breakEvenMonth}`, icon: CheckCircle, color: 'text-emerald-400' },
        ].map((metric, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <metric.icon className={`w-5 h-5 ${metric.color} mb-2`} />
            <div className="text-lg font-bold text-white">{metric.value}</div>
            <div className="text-xs text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Input Controls */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Financial Assumptions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'monthlySubPrice', label: 'Price/mo', min: 99, max: 9999, step: 50 },
            { key: 'conversionRate', label: 'Conversion', min: 0.01, max: 0.2, step: 0.01, format: (v: number) => `${(v * 100).toFixed(0)}%` },
            { key: 'churnRate', label: 'Churn', min: 0.01, max: 0.3, step: 0.01, format: (v: number) => `${(v * 100).toFixed(0)}%` },
            { key: 'cac', label: 'CAC', min: 100, max: 5000, step: 100 },
            { key: 'ltv', label: 'LTV', min: 500, max: 50000, step: 500 },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-500 mb-1">{field.label}</label>
              <input
                type="number"
                value={inputs[field.key as keyof FinancialInputs]}
                onChange={(e) => updateInput(field.key as keyof FinancialInputs, parseFloat(e.target.value) || 0)}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-600 text-white text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Projections Chart */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">24-Month Projections</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2640" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #3d3860', borderRadius: '12px' }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} dot={false} name="MRR" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={false} name="Expenses" />
              <Line type="monotone" dataKey="cashBalance" stroke="#7c3aed" strokeWidth={2} dot={false} name="Cash Balance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Sensitivity Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensitivity.map((scenario, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                scenario.name === 'Optimistic' ? 'bg-emerald-600/5 border-emerald-500/20' :
                scenario.name === 'Pessimistic' ? 'bg-red-600/5 border-red-500/20' :
                'bg-violet-600/5 border-violet-500/20'
              }`}
            >
              <h4 className={`text-sm font-semibold mb-3 ${
                scenario.name === 'Optimistic' ? 'text-emerald-400' :
                scenario.name === 'Pessimistic' ? 'text-red-400' :
                'text-violet-400'
              }`}>{scenario.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Break-even</span>
                  <span className="text-white font-medium">Month {scenario.breakEvenMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Runway</span>
                  <span className="text-white font-medium">{scenario.runway} mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LTV:CAC</span>
                  <span className="text-white font-medium">{scenario.ltvCacRatio}:1</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valuation & Cap Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Valuation Estimate</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20">
              <div className="text-sm text-gray-500 mb-1">Pre-Money Valuation</div>
              <div className="text-3xl font-bold text-gradient">{formatCurrency(valuation.preMoney)}</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-800/50">
              <div className="text-sm text-gray-500 mb-1">Post-Money Valuation</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(valuation.postMoney)}</div>
            </div>
            <p className="text-xs text-gray-500">{valuation.methodology}</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Cap Table</h3>
          <div className="space-y-3">
            {capTable.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50">
                <div>
                  <div className="text-sm font-medium text-gray-200">{entry.party}</div>
                  <div className="text-xs text-gray-500">{entry.percentage}%</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-violet-400">{formatCurrency(entry.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
