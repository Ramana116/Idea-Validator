import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft, BarChart3, Target, Users, TrendingUp, Zap,
  Shield, AlertTriangle, FileText, Presentation, MessageSquare,
  DollarSign, Layers, Award, Building2, Search,
  ChevronDown, ChevronUp, Download, Share2, Copy, Mail, CheckCircle
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell
} from 'recharts';
import type { AnalysisResult } from '../utils/mockData';
import MentorChat from './MentorChat';
import PitchDeck from './PitchDeck';
import FinancialModel from './FinancialModel';
import CustomerDiscovery from './CustomerDiscovery';
import TaskPlanner from './TaskPlanner';

interface DashboardProps {
  analysis: AnalysisResult;
  onBack: () => void;
}

type TabId = 'overview' | 'market' | 'competitors' | 'revenue' | 'financial' | 'customer' | 'tasks' | 'business' | 'risks' | 'plan' | 'pitch' | 'mentor';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'market', label: 'Market', icon: Target },
  { id: 'competitors', label: 'Competitors', icon: Users },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'financial', label: 'Financial Model', icon: DollarSign },
  { id: 'customer', label: 'Customer Discovery', icon: Users },
  { id: 'tasks', label: 'Task Planner', icon: CheckCircle },
  { id: 'business', label: 'Business', icon: Layers },
  { id: 'risks', label: 'Risks', icon: Shield },
  { id: 'plan', label: 'Business Plan', icon: FileText },
  { id: 'pitch', label: 'Pitch Deck', icon: Presentation },
  { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
];

function ScoreRing({ score, size = 120, strokeWidth = 8, label, sublabel }: {
  score: number; size?: number; strokeWidth?: number; label?: string; sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e1b2e" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
            strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-500">/100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-300 mt-2">{label}</span>}
      {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
    </div>
  );
}

function OverviewTab({ analysis }: { analysis: AnalysisResult }) {
  const radarData = [
    { metric: 'Market Demand', value: analysis.validationBreakdown.marketDemand },
    { metric: 'Competition', value: analysis.validationBreakdown.competition },
    { metric: 'Revenue', value: analysis.validationBreakdown.revenuePotential },
    { metric: 'Scalability', value: analysis.validationBreakdown.scalability },
    { metric: 'Innovation', value: analysis.validationBreakdown.innovation },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreRing score={analysis.validationScore} size={140} label="Validation Score" />
          <p className={`text-sm mt-3 font-medium ${
            analysis.validationScore >= 80 ? 'text-emerald-400' : analysis.validationScore >= 60 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {analysis.validationScore >= 80 ? '✅ Recommended for Development' : analysis.validationScore >= 60 ? '⚠️ Needs Refinement' : '❌ High Risk'}
          </p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreRing score={analysis.investorReadiness} size={140} label="Investor Readiness" sublabel="Investment Potential" />
          <p className="text-sm mt-3 text-violet-400 font-medium">
            {analysis.investorReadiness >= 80 ? '🏆 Highly Attractive' : analysis.investorReadiness >= 60 ? '📊 Promising' : '⚠️ Needs More Traction'}
          </p>
        </div>
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <ScoreRing score={analysis.successProbability} size={140} label="Success Probability" sublabel="AI Predicted" />
          <p className="text-sm mt-3 text-emerald-400 font-medium">
            Based on {analysis.industry.industry} industry data
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Validation Breakdown</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#2a2640" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Industry Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Industry', value: analysis.industry.industry, icon: Building2 },
            { label: 'Category', value: analysis.industry.category, icon: Layers },
            { label: 'Business Type', value: analysis.industry.businessType, icon: Users },
            { label: 'Markets', value: analysis.industry.potentialMarkets.length + ' identified', icon: Target },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-800/50">
              <item.icon className="w-5 h-5 text-violet-400 mb-2" />
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-sm font-semibold text-gray-200">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">Target Audience</div>
          <div className="flex flex-wrap gap-2">
            {analysis.industry.targetAudience.map((a, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-300 text-xs">{a}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Opportunity Gaps Found</h3>
        <div className="space-y-3">
          {analysis.gaps.map((gap, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/30">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-200">{gap.area}</div>
                <div className="text-xs text-gray-500 mt-0.5">{gap.description}</div>
              </div>
              <div className="text-sm font-bold text-emerald-400 flex-shrink-0">{gap.opportunityScore}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketTab({ analysis }: { analysis: AnalysisResult }) {
  const barData = [
    { name: 'TAM', value: parseFloat(analysis.market.tam.replace(/[^0-9.]/g, '')) || 1, label: analysis.market.tam },
    { name: 'SAM', value: parseFloat(analysis.market.sam.replace(/[^0-9.]/g, '')) || 1, label: analysis.market.sam },
    { name: 'SOM', value: parseFloat(analysis.market.som.replace(/[^0-9.]/g, '')) || 1, label: analysis.market.som },
  ];

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Market Demand Score</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            analysis.market.marketStatus === 'Excellent' ? 'bg-emerald-600/20 text-emerald-400' :
            analysis.market.marketStatus === 'Good' ? 'bg-blue-600/20 text-blue-400' :
            analysis.market.marketStatus === 'Moderate' ? 'bg-amber-600/20 text-amber-400' :
            'bg-red-600/20 text-red-400'
          }`}>
            {analysis.market.marketStatus}
          </span>
        </div>
        <div className="flex items-center gap-8">
          <ScoreRing score={analysis.market.demandScore} size={160} strokeWidth={10} />
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50">
              <span className="text-sm text-gray-400">TAM</span>
              <span className="text-lg font-bold text-violet-400">{analysis.market.tam}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50">
              <span className="text-sm text-gray-400">SAM</span>
              <span className="text-lg font-bold text-emerald-400">{analysis.market.sam}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50">
              <span className="text-sm text-gray-400">SOM</span>
              <span className="text-lg font-bold text-amber-400">{analysis.market.som}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Market Size Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2640" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #3d3860', borderRadius: '12px', color: '#e5e7eb' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={['#7c3aed', '#10b981', '#f59e0b'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Market Growth</h3>
          <div className="text-3xl font-bold text-gradient mb-2">{analysis.market.growthRate}</div>
          <p className="text-sm text-gray-500">Compound Annual Growth Rate</p>
          <div className="mt-4 w-full bg-surface-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-violet-600 to-emerald-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, parseFloat(analysis.market.growthRate) * 4)}%` }}
            />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Key Trends</h3>
          <div className="space-y-2">
            {analysis.market.trends.map((trend, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <span className="text-gray-300">{trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Potential Markets</h3>
        <div className="flex flex-wrap gap-3">
          {analysis.industry.potentialMarkets.map((market, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-600">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-sm text-gray-300">{market}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompetitorsTab({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-violet-400" />
          <div>
            <h3 className="text-lg font-semibold">Competitor Intelligence</h3>
            <p className="text-sm text-gray-500">{analysis.competitors.length} competitors analyzed</p>
          </div>
        </div>

        <div className="space-y-4">
          {analysis.competitors.map((comp, i) => (
            <div key={i} className="rounded-xl bg-surface-800/50 border border-surface-700 overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-200">{comp.name}</h4>
                  <span className="text-xs text-gray-500">{comp.pricing} • {comp.marketShare} market share</span>
                </div>
                <div className="text-2xl font-bold text-violet-400">{comp.marketShare}</div>
              </div>
              <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Features</div>
                  <div className="space-y-1">
                    {comp.features.map((f, j) => (
                      <div key={j} className="text-sm text-gray-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Strengths</div>
                  <div className="space-y-1">
                    {comp.strengths.map((s, j) => (
                      <div key={j} className="text-sm text-emerald-400 flex items-center gap-2">
                        <span className="text-emerald-500">✓</span>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Weaknesses</div>
                  <div className="space-y-1">
                    {comp.weaknesses.map((w, j) => (
                      <div key={j} className="text-sm text-red-400 flex items-center gap-2">
                        <span className="text-red-500">✗</span>
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Gap Analysis — What Competitors Are NOT Doing</h3>
        <div className="space-y-4">
          {analysis.gaps.map((gap, i) => (
            <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-emerald-600/5 to-transparent border border-emerald-500/20">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-emerald-300">{gap.area}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold">
                  {gap.opportunityScore}% Opportunity
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-2">{gap.description}</p>
              <div className="text-xs text-gray-500">
                Missing in: {gap.competitors.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueTab({ analysis }: { analysis: AnalysisResult }) {
  const scenarios = [
    { name: 'Conservative', year1: analysis.revenue.conservative.year1, year3: analysis.revenue.conservative.year3, year5: analysis.revenue.conservative.year5, color: '#f59e0b' },
    { name: 'Expected', year1: analysis.revenue.expected.year1, year3: analysis.revenue.expected.year3, year5: analysis.revenue.expected.year5, color: '#7c3aed' },
    { name: 'Optimistic', year1: analysis.revenue.optimistic.year1, year3: analysis.revenue.optimistic.year3, year5: analysis.revenue.optimistic.year5, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, i) => (
          <div key={i} className="glass rounded-2xl p-6" style={{ borderTop: `3px solid ${scenario.color}` }}>
            <h4 className="text-sm font-medium mb-4" style={{ color: scenario.color }}>{scenario.name}</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Year 1</div>
                <div className="text-lg font-bold text-gray-200">{scenario.year1}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Year 3</div>
                <div className="text-lg font-bold text-gray-200">{scenario.year3}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Year 5</div>
                <div className="text-lg font-bold text-gray-200">{scenario.year5}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Projection</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { period: 'Year 1', Conservative: 10, Expected: 25, Optimistic: 50 },
                { period: 'Year 3', Conservative: 45, Expected: 120, Optimistic: 300 },
                { period: 'Year 5', Conservative: 150, Expected: 400, Optimistic: 1000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2640" />
              <XAxis dataKey="period" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #3d3860', borderRadius: '12px', color: '#e5e7eb' }}
                formatter={(value) => [`₹${value} Lakhs`, 'Revenue']}
              />
              <Legend />
              <Bar dataKey="Conservative" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expected" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Optimistic" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recommended Pricing</h3>
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20">
          <div className="text-sm text-gray-400 mb-1">Recommended Model: {analysis.businessModel.recommended}</div>
          <div className="text-2xl font-bold text-gradient">{analysis.businessModel.pricing}</div>
        </div>
        <div className="mt-4 space-y-2">
          {analysis.businessModel.models.map((model, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50">
              <div>
                <div className="text-sm font-medium text-gray-200">{model.name}</div>
                <div className="text-xs text-gray-500">{model.description}</div>
              </div>
              <div className="text-sm font-bold text-violet-400">{model.suitability}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessTab({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Business Model</h3>
        <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20 text-center">
          <div className="text-xs text-gray-400 mb-1">Recommended</div>
          <div className="text-xl font-bold text-gradient">{analysis.businessModel.recommended}</div>
          <div className="text-emerald-400 font-medium mt-1">{analysis.businessModel.pricing}</div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">SWOT Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-600/5 border border-emerald-500/20">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.swot.strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">●</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-600/5 border border-red-500/20">
            <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Weaknesses
            </h4>
            <ul className="space-y-2">
              {analysis.swot.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">●</span> {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Opportunities
            </h4>
            <ul className="space-y-2">
              {analysis.swot.opportunities.map((o, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span> {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-500/20">
            <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Threats
            </h4>
            <ul className="space-y-2">
              {analysis.swot.threats.map((t, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">●</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Funding Recommendations — {analysis.funding.stage}</h3>
        <div className="space-y-3">
          {analysis.funding.recommendations.map((rec, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{rec.type}</span>
                  <span className="text-xs text-gray-500">{rec.name}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{rec.description}</div>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm font-bold text-violet-400">{rec.fit}%</div>
                <div className="text-xs text-gray-500">Fit</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RisksTab({ analysis }: { analysis: AnalysisResult }) {
  const severityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-600/20 border-red-500/30';
      case 'Medium': return 'text-amber-400 bg-amber-600/20 border-amber-500/30';
      case 'Low': return 'text-emerald-400 bg-emerald-600/20 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-500/30';
    }
  };

  const categoryIcon = (category: string) => {
    switch (category) {
      case 'Technical': return '⚙️';
      case 'Financial': return '💰';
      case 'Legal': return '⚖️';
      case 'Market': return '📊';
      case 'Operational': return '🔧';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {['High', 'Medium', 'Low'].map((sev) => {
          const count = analysis.risks.filter(r => r.severity === sev).length;
          return (
            <div key={sev} className={`glass rounded-xl p-4 text-center border ${severityColor(sev).split(' ')[2]}`}>
              <div className={`text-3xl font-bold ${severityColor(sev).split(' ')[0]}`}>{count}</div>
              <div className="text-xs text-gray-500 mt-1">{sev} Risk</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {analysis.risks.map((risk, i) => (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <RiskCard risk={risk} severityColor={severityColor(risk.severity)} categoryIcon={categoryIcon(risk.category)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskCard({ risk, severityColor, categoryIcon }: {
  risk: { category: string; title: string; description: string; severity: string; solution: string };
  severityColor: string;
  categoryIcon: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{categoryIcon}</span>
          <div>
            <div className="text-sm font-medium text-gray-200">{risk.title}</div>
            <div className="text-xs text-gray-500">{risk.category} Risk</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs border ${severityColor}`}>{risk.severity}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4 space-y-3">
          <div className="p-3 rounded-lg bg-surface-800/50">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-gray-300">{risk.description}</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-600/5 border border-emerald-500/20">
            <div className="text-xs text-emerald-400 mb-1">Recommended Solution</div>
            <div className="text-sm text-gray-300">{risk.solution}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function BusinessPlanTab({ analysis }: { analysis: AnalysisResult }) {
  const handleExportPDF = async () => {
    try {
      const { exportAnalysisReportToPDF } = await import('../utils/pdfExport');
      await exportAnalysisReportToPDF('business-plan-report', `${analysis.idea.name.replace(/\s+/g, '_')}_Business_Plan`);
      toast.success('Business plan PDF downloaded!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handleExportWord = async () => {
    try {
      const { exportBusinessPlanToWord } = await import('../utils/pdfExport');
      await exportBusinessPlanToWord(analysis, `${analysis.idea.name.replace(/\s+/g, '_')}_Business_Plan`);
      toast.success('Business plan Word document downloaded!');
    } catch {
      toast.error('Failed to export Word document');
    }
  };

  const handleShare = async () => {
    try {
      const { shareReport } = await import('../utils/pdfExport');
      await shareReport(analysis);
      toast.success('Report shared!');
    } catch {
      toast.error('Failed to share');
    }
  };

  const handleCopySummary = async () => {
    try {
      const { copyToClipboard } = await import('../utils/pdfExport');
      const summary = `${analysis.idea.name} - Validation Score: ${analysis.validationScore}/100\nIndustry: ${analysis.industry.industry}\nMarket Demand: ${analysis.market.demandScore}/100\nTAM: ${analysis.market.tam}\nGrowth: ${analysis.market.growthRate}`;
      await copyToClipboard(summary);
      toast.success('Summary copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${analysis.idea.name} - Business Plan`);
    const body = encodeURIComponent(`Business Plan for ${analysis.idea.name}\n\nValidation Score: ${analysis.validationScore}/100\n\nExecutive Summary:\n${analysis.businessPlan.executiveSummary}\n\nGenerated by StartupValidator.ai`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    toast.success('Opening email client...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all text-sm">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
        <button onClick={handleExportWord} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-all text-sm">
          <FileText className="w-4 h-4" />
          Export Word
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-gray-400 border border-surface-600 hover:text-white transition-all text-sm">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button onClick={handleCopySummary} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-gray-400 border border-surface-600 hover:text-white transition-all text-sm">
          <Copy className="w-4 h-4" />
          Copy Summary
        </button>
        <button onClick={handleEmail} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-gray-400 border border-surface-600 hover:text-white transition-all text-sm">
          <Mail className="w-4 h-4" />
          Email
        </button>
      </div>

      <div id="business-plan-report" className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-700">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{analysis.idea.name}</h2>
            <p className="text-sm text-gray-500">{analysis.industry.industry} • Validation Score: {analysis.validationScore}/100</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Executive Summary
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.businessPlan.executiveSummary}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Market Analysis</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{analysis.businessPlan.marketAnalysis}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Segments</h3>
            <div className="space-y-2">
              {analysis.businessPlan.customerSegments.map((seg, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  {seg}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Revenue Streams</h3>
            <div className="space-y-2">
              {analysis.businessPlan.revenueStreams.map((stream, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {stream}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Marketing Plan</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{analysis.businessPlan.marketingPlan}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Growth Strategy</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{analysis.businessPlan.growthStrategy}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Cost Structure</h3>
          <div className="space-y-3">
            {analysis.businessPlan.costStructure.map((cost, i) => {
              const match = cost.match(/(.+)\s*\((\d+)%\)/);
              const label = match ? match[1] : cost;
              const pct = match ? parseInt(match[2]) : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-300">{label}</span>
                    <span className="text-gray-500">{pct}%</span>
                  </div>
                  <div className="w-full bg-surface-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-600 to-emerald-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Key Milestones</h3>
          <div className="space-y-3">
            {analysis.businessPlan.milestones.map((milestone, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  i < 2 ? 'bg-emerald-600/30 text-emerald-400' : 'bg-violet-600/30 text-violet-400'
                }`}>
                  {i + 1}
                </div>
                <div className="text-sm text-gray-300">{milestone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ analysis, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab analysis={analysis} />;
      case 'market': return <MarketTab analysis={analysis} />;
      case 'competitors': return <CompetitorsTab analysis={analysis} />;
      case 'revenue': return <RevenueTab analysis={analysis} />;
      case 'financial': return <FinancialModel analysis={analysis} />;
      case 'customer': return <CustomerDiscovery analysis={analysis} />;
      case 'tasks': return <TaskPlanner analysis={analysis} />;
      case 'business': return <BusinessTab analysis={analysis} />;
      case 'risks': return <RisksTab analysis={analysis} />;
      case 'plan': return <BusinessPlanTab analysis={analysis} />;
      case 'pitch': return <PitchDeck analysis={analysis} />;
      case 'mentor': return <MentorChat />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-surface-800 bg-surface-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-surface-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold">{analysis.idea.name}</h1>
              <p className="text-xs text-gray-500">{analysis.industry.industry} • Score: {analysis.validationScore}/100</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Analysis Complete</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-surface-800">
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-surface-950/95 backdrop-blur-xl' : 'hidden'} lg:block lg:relative lg:w-56 lg:bg-transparent lg:backdrop-blur-none border-r border-surface-800`}>
          <nav className="p-3 space-y-1 overflow-y-auto h-full lg:h-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-surface-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-surface-950/50" onClick={() => setMobileMenuOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
