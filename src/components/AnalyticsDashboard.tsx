import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Award, Activity, Target, 
  BarChart3, PieChart, Zap,
  Download, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  calculateAnalytics, getInsights, generateReportCard,
  getBenchmarkPercentile, exportAnalytics
} from '../utils/analytics';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart as RechartsPie, Pie, Cell
} from 'recharts';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

export default function AnalyticsDashboard({ onClose }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ReturnType<typeof calculateAnalytics> | null>(null);
  const [reportCard, setReportCard] = useState<ReturnType<typeof generateReportCard> | null>(null);

  useEffect(() => {
    const data = calculateAnalytics();
    setAnalytics(data);
    setReportCard(generateReportCard(data));
  }, []);

  if (!analytics || !reportCard) return null;

  const insights = getInsights(analytics);
  const percentile = getBenchmarkPercentile(analytics);

  const scoreDistributionData = [
    { name: 'Excellent (80+)', value: analytics.scoreDistribution.excellent, color: '#10b981' },
    { name: 'Good (60-79)', value: analytics.scoreDistribution.good, color: '#f59e0b' },
    { name: 'Needs Work (<60)', value: analytics.scoreDistribution.needsWork, color: '#ef4444' },
  ];

  const industryData = Object.entries(analytics.industryBreakdown)
    .map(([name, value], i) => ({
      name,
      value,
      color: ['#7c3aed', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'][i % 5],
    }));

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-amber-400';
      case 'D': return 'text-orange-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-surface-900 rounded-2xl border border-surface-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-800 sticky top-0 bg-surface-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Analytics</h2>
              <p className="text-sm text-gray-500">Track your startup validation journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportAnalytics}
              className="p-2 rounded-lg bg-surface-800 text-gray-400 hover:text-white transition-colors"
              title="Export Analytics"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-800 transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                Validation Report Card
              </h3>
              <div className={`text-5xl font-black ${getGradeColor(reportCard.grade)}`}>
                {reportCard.grade}
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">{reportCard.feedback}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Activity', value: reportCard.scores.activity, icon: Activity },
                { label: 'Quality', value: reportCard.scores.quality, icon: Target },
                { label: 'Improvement', value: reportCard.scores.improvement, icon: TrendingUp },
                { label: 'Diversity', value: reportCard.scores.diversity, icon: PieChart },
              ].map((metric, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-800/50">
                  <metric.icon className="w-5 h-5 text-violet-400 mb-2" />
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs text-gray-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-gray-500">Total Analyses</span>
              </div>
              <div className="text-2xl font-bold">{analytics.totalAnalyses}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-500">Average Score</span>
              </div>
              <div className="text-2xl font-bold">{analytics.averageScore}</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-gray-500">Streak</span>
              </div>
              <div className="text-2xl font-bold">{analytics.streakDays} days</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-500">Percentile</span>
              </div>
              <div className="text-2xl font-bold">{percentile}%</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Score Trend</h3>
              {analytics.trendData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2640" />
                      <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #3d3860', borderRadius: '8px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        dot={{ fill: '#7c3aed', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                  No data yet
                </div>
              )}
            </div>

            {/* Score Distribution */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              {analytics.totalAnalyses > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={scoreDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #3d3860', borderRadius: '8px' }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                  No data yet
                </div>
              )}
              <div className="flex justify-center gap-4 mt-2">
                {scoreDistributionData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industry Breakdown */}
          {analytics.totalAnalyses > 0 && Object.keys(analytics.industryBreakdown).length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Industries Explored</h3>
              <div className="flex flex-wrap gap-2">
                {industryData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800/50"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-gray-500">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Idea */}
          {analytics.bestIdea && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Best Idea
              </h3>
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{analytics.bestIdea.idea.name}</h4>
                  <span className="text-amber-400 font-bold">{analytics.bestIdea.validationScore}/100</span>
                </div>
                <p className="text-sm text-gray-400">{analytics.bestIdea.idea.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span>{analytics.bestIdea.industry}</span>
                  <span>•</span>
                  <span>{new Date(analytics.bestIdea.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    insight.type === 'success'
                      ? 'bg-emerald-600/5 border-emerald-500/20'
                      : insight.type === 'warning'
                      ? 'bg-amber-600/5 border-amber-500/20'
                      : 'bg-blue-600/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === 'success' ? (
                      <ArrowUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : insight.type === 'warning' ? (
                      <ArrowDown className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`text-sm font-semibold mb-1 ${
                        insight.type === 'success' ? 'text-emerald-300' :
                        insight.type === 'warning' ? 'text-amber-300' :
                        'text-blue-300'
                      }`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-400">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
