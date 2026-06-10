import { useState } from 'react';
import { Users, MessageSquare, FileText, Lightbulb, Copy, Check } from 'lucide-react';
import {
  generateCustomerPersona,
  generateInterviewQuestions,
  generateSurveyTemplate,
  generateLandingPageCopy,
  calculateValidationScore,
  MOM_TEST_PRINCIPLES,
} from '../utils/customerDiscovery';
import type { AnalysisResult } from '../utils/mockData';

interface CustomerDiscoveryProps {
  analysis: AnalysisResult;
}

export default function CustomerDiscovery({ analysis }: CustomerDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<'persona' | 'interviews' | 'survey' | 'landing' | 'validate'>('persona');
  const [copied, setCopied] = useState(false);
  const [validationResponses, setValidationResponses] = useState({
    problemSeverity: 4,
    currentSpend: 3,
    satisfaction: 2,
    interest: 4,
    willingnessToPay: 3,
  });

  const persona = generateCustomerPersona(analysis.industry.industry, analysis.idea.targetAudience);
  const interviewQuestions = generateInterviewQuestions('solution');
  const surveyTemplate = generateSurveyTemplate(analysis.industry.industry);
  const landingCopy = generateLandingPageCopy(analysis.idea);
  const validationScore = calculateValidationScore(validationResponses);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'persona' as const, label: 'Customer Persona', icon: Users },
    { id: 'interviews' as const, label: 'Interview Questions', icon: MessageSquare },
    { id: 'survey' as const, label: 'Survey Template', icon: FileText },
    { id: 'landing' as const, label: 'Landing Page', icon: Lightbulb },
    { id: 'validate' as const, label: 'Validation Score', icon: Check },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                : 'bg-surface-800 text-gray-400 border border-surface-700 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Persona Tab */}
      {activeTab === 'persona' && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Target Customer Persona</h3>
            <button
              onClick={() => handleCopy(JSON.stringify(persona, null, 2))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 text-gray-400 hover:text-white text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20 mb-4">
                <h4 className="text-xl font-bold text-white mb-1">{persona.name}</h4>
                <p className="text-sm text-gray-400">Primary Target Customer</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-300 mb-2">Demographics</h5>
                  <ul className="space-y-1">
                    {persona.demographics.map((d, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-gray-300 mb-2">Psychographics</h5>
                  <ul className="space-y-1">
                    {persona.psychographics.map((p, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-300 mb-2">Pain Points</h5>
                <ul className="space-y-2">
                  {persona.painPoints.map((p, i) => (
                    <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">●</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-300 mb-2">Goals</h5>
                <ul className="space-y-2">
                  {persona.goals.map((g, i) => (
                    <li key={i} className="text-sm text-emerald-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">●</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-300 mb-2">Preferred Channels</h5>
                <div className="flex flex-wrap gap-2">
                  {persona.preferredChannels.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-surface-800 text-xs text-gray-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-surface-800/50 border-l-4 border-violet-500">
            <p className="text-sm text-gray-400 italic">"{persona.quote}"</p>
          </div>
        </div>
      )}

      {/* Interview Questions Tab */}
      {activeTab === 'interviews' && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Interview Questions</h3>
            <p className="text-sm text-gray-400 mb-6">Use these questions to validate your startup idea. Follow the Mom Test principles.</p>

            <div className="space-y-4">
              {interviewQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      q.category === 'Problem' ? 'bg-red-600/20 text-red-300' :
                      q.category === 'Solution' ? 'bg-emerald-600/20 text-emerald-300' :
                      q.category === 'Pricing' ? 'bg-amber-600/20 text-amber-300' :
                      'bg-blue-600/20 text-blue-300'
                    }`}>
                      {q.category}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-gray-200 mb-2">{q.question}</h4>
                  <div className="space-y-1">
                    {q.followUp.map((f, j) => (
                      <div key={j} className="text-sm text-gray-500 pl-4 border-l-2 border-surface-600">
                        → {f}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 rounded-lg bg-violet-600/5 border border-violet-500/20">
                    <p className="text-xs text-violet-300"><strong>Listen for:</strong> {q.whatToListenFor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Mom Test Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOM_TEST_PRINCIPLES.map((principle, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-800/50">
                  <h4 className="text-sm font-semibold text-gray-200 mb-1">{principle.principle}</h4>
                  <p className="text-xs text-gray-500">{principle.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Survey Template Tab */}
      {activeTab === 'survey' && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">{surveyTemplate.title}</h3>
              <p className="text-sm text-gray-400">{surveyTemplate.description}</p>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(surveyTemplate, null, 2))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 text-gray-400 hover:text-white text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              Copy
            </button>
          </div>

          <div className="space-y-4">
            {surveyTemplate.questions.map((q, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-800/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-200">{i + 1}. {q.question}</h4>
                  {q.required && <span className="text-xs text-red-400">Required</span>}
                </div>
                <div className="text-xs text-gray-500 capitalize">{q.type.replace('_', ' ')} question</div>
                {q.options && (
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, j) => (
                      <div key={j} className="text-sm text-gray-400 flex items-center gap-2">
                        <div className="w-3 h-3 rounded border border-surface-600" />
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Landing Page Tab */}
      {activeTab === 'landing' && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Landing Page Copy</h3>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20">
              <h4 className="text-2xl font-bold text-white mb-2">{landingCopy.headline}</h4>
              <p className="text-gray-300 mb-4">{landingCopy.subheadline}</p>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-semibold">
                {landingCopy.cta}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Value Propositions</h4>
                <ul className="space-y-2">
                  {landingCopy.valueProps.map((v, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Social Proof</h4>
                <div className="p-4 rounded-xl bg-surface-800/50">
                  <p className="text-sm text-gray-400">{landingCopy.socialProof}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Score Tab */}
      {activeTab === 'validate' && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Validation Score Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[
                { key: 'problemSeverity', label: 'Problem Severity (1-5)', min: 1, max: 5 },
                { key: 'currentSpend', label: 'Current Spend (0-4)', min: 0, max: 4 },
                { key: 'satisfaction', label: 'Satisfaction (1-5)', min: 1, max: 5 },
                { key: 'interest', label: 'Interest Level (1-5)', min: 1, max: 5 },
                { key: 'willingnessToPay', label: 'Willingness to Pay (0-4)', min: 0, max: 4 },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-2">{field.label}</label>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={validationResponses[field.key as keyof typeof validationResponses]}
                    onChange={(e) => setValidationResponses(prev => ({
                      ...prev,
                      [field.key]: parseInt(e.target.value),
                    }))}
                    className="w-full accent-violet-500"
                  />
                  <div className="text-center text-sm font-bold text-violet-400 mt-1">
                    {validationResponses[field.key as keyof typeof validationResponses]}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-violet-600/10 to-emerald-600/10 border border-violet-500/20 text-center">
              <div className={`text-5xl font-black mb-2 ${
                validationScore.score >= 80 ? 'text-emerald-400' :
                validationScore.score >= 60 ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {validationScore.score}%
              </div>
              <div className="text-lg font-semibold text-white mb-2">{validationScore.verdict}</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
            <div className="space-y-3">
              {validationScore.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-800/50">
                  <div className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
