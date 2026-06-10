import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Zap, Target, TrendingUp, Shield,
  ChevronRight, Sparkles, BarChart3, Search, Lightbulb,
  ArrowRight, Check
} from 'lucide-react';
import { EXAMPLE_IDEAS, type StartupIdea } from '../utils/mockData';

interface LandingProps {
  onSubmit: (idea: StartupIdea) => void;
  onLoading: (idea: StartupIdea) => void;
}

const FEATURES = [
  { icon: Brain, title: 'AI Idea Analyzer', desc: 'Deep industry analysis with market categorization and target audience identification', color: 'from-violet-500 to-purple-600' },
  { icon: BarChart3, title: 'Market Demand Analysis', desc: 'TAM, SAM, SOM calculations with real-time demand scoring and growth projections', color: 'from-emerald-500 to-teal-600' },
  { icon: Search, title: 'Competitor Intelligence', desc: 'Automatic competitor discovery with feature comparison and market share analysis', color: 'from-blue-500 to-cyan-600' },
  { icon: Target, title: 'Gap Finder', desc: 'Identifies untapped opportunities that competitors are not addressing', color: 'from-amber-500 to-orange-600' },
  { icon: TrendingUp, title: 'Revenue Prediction', desc: '5-year revenue projections with conservative, expected, and optimistic scenarios', color: 'from-green-500 to-emerald-600' },
  { icon: Shield, title: 'Risk Detection', desc: 'Comprehensive risk assessment across technical, financial, legal, and market categories', color: 'from-red-500 to-rose-600' },
];

const STATS = [
  { value: '90%', label: 'Startup Failure Rate' },
  { value: '63%', label: 'Due to No Market Need' },
  { value: '15 min', label: 'Analysis Time' },
  { value: '100%', label: 'AI-Powered Insights' },
];

export default function Landing({ onSubmit, onLoading }: LandingProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) return;
    const idea: StartupIdea = {
      name: name.trim(),
      description: description.trim(),
      industry: industry.trim() || 'General',
      targetAudience: targetAudience.trim() || 'General',
    };
    onLoading(idea);
    setTimeout(() => onSubmit(idea), 3000);
  };

  const loadExample = (example: StartupIdea) => {
    setName(example.name);
    setDescription(example.description);
    setIndustry(example.industry);
    setTargetAudience(example.targetAudience);
    const idea = { ...example };
    onLoading(idea);
    setTimeout(() => onSubmit(idea), 3000);
  };

  const isFormValid = name.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="min-h-screen bg-surface-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid opacity-50" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-radial pointer-events-none" />
      <div className="fixed top-1/4 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="fixed bottom-1/4 -right-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Startup<span className="text-gradient">Validator</span>.ai
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Get Started Free
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 px-6 pt-16 pb-20 lg:pt-24 lg:pb-32 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Multi-Agent System</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Validate Your Startup
            <br />
            <span className="text-gradient">Before You Build It</span>
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            90% of startups fail because they build products nobody wants. Our AI analyzes your idea,
            finds competitors, predicts revenue, and generates a complete business plan — all in minutes.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {STATS.map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="text-2xl lg:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Idea Input Form */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-2xl p-6 lg:p-8 gradient-border">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Startup Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., AI Interview Coach"
                      className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm appearance-none"
                    >
                      <option value="" className="bg-surface-800">Select Industry</option>
                      <option value="EdTech" className="bg-surface-800">EdTech</option>
                      <option value="FinTech" className="bg-surface-800">FinTech</option>
                      <option value="HealthTech" className="bg-surface-800">HealthTech</option>
                      <option value="E-Commerce" className="bg-surface-800">E-Commerce</option>
                      <option value="SaaS" className="bg-surface-800">SaaS / B2B</option>
                      <option value="Other" className="bg-surface-800">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Describe Your Startup Idea</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="I want to build an AI-powered platform that..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Students, Fresh Graduates, Job Seekers"
                    className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-600 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                    isFormValid
                      ? 'bg-gradient-to-r from-violet-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-violet-500/25 cursor-pointer'
                      : 'bg-surface-700 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  Analyze My Startup Idea
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Example Ideas */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 text-center">Or try a pre-built example:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {EXAMPLE_IDEAS.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => loadExample(idea)}
                    className="px-4 py-2 rounded-full bg-surface-800/50 border border-surface-600 text-gray-400 text-xs hover:border-violet-500/50 hover:text-violet-300 transition-all"
                  >
                    {idea.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient">15+ AI Modules</span> Working Together
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our multi-agent AI architecture collaborates to give you a complete startup analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-gray-400">Three simple steps to validate your startup idea</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Lightbulb, title: 'Enter Your Idea', desc: 'Describe your startup concept, target audience, and industry. Our AI understands context.' },
              { step: '02', icon: Brain, title: 'AI Analyzes', desc: 'Six AI agents work together to research market, competitors, revenue, risks, and opportunities.' },
              { step: '03', icon: BarChart3, title: 'Get Your Report', desc: 'Receive a comprehensive analysis with validation score, business plan, and pitch deck.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-surface-800 border border-surface-600 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass rounded-3xl p-8 lg:p-12 text-center gradient-border relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-emerald-600/10" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Validate Your Idea?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of founders who saved months of research by validating their ideas first.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {['Free Analysis', 'No Credit Card', 'Instant Results', 'AI-Powered'].map((tag, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm text-emerald-400">
                    <Check className="w-4 h-4" />
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 lg:px-12 border-t border-surface-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">StartupValidator.ai</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 AI Startup Idea Validator. Built with multi-agent AI architecture.</p>
        </div>
      </footer>
    </div>
  );
}
