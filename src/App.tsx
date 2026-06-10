import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Brain, Loader2, Sparkles, Zap, ArrowRight, History, Moon, Sun, BarChart3 } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import HistoryPanel from './components/HistoryPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { generateAnalysis, type StartupIdea, type AnalysisResult } from './utils/mockData';
import { saveAnalysis, getAnalysisById } from './utils/storage';

type AppView = 'landing' | 'loading' | 'dashboard';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<AppView>('landing');
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const LOADING_STEPS = [
    { text: 'Analyzing startup idea...', icon: Brain },
    { text: 'Researching market demand...', icon: Sparkles },
    { text: 'Identifying competitors...', icon: Zap },
    { text: 'Calculating revenue projections...', icon: ArrowRight },
    { text: 'Generating business plan...', icon: Loader2 },
    { text: 'Preparing your report...', icon: Loader2 },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        setHistoryOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleTheme]);

  const handleLoading = useCallback((newIdea: StartupIdea) => {
    setIdea(newIdea);
    setView('loading');
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  }, []);

  const handleSubmit = useCallback((newIdea: StartupIdea) => {
    setIdea(newIdea);
    const result = generateAnalysis(newIdea);
    setAnalysis(result);
    setView('dashboard');
    saveAnalysis(result);
  }, []);

  const handleBack = useCallback(() => {
    setView('landing');
    setIdea(null);
    setAnalysis(null);
    setLoadingStep(0);
  }, []);

  const handleLoadAnalysis = useCallback((id: string) => {
    const saved = getAnalysisById(id);
    if (saved) {
      const result = generateAnalysis(saved.idea);
      setIdea(saved.idea);
      setAnalysis(result);
      setView('dashboard');
      setHistoryOpen(false);
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-surface-950 text-white">
        {/* Global Header Actions */}
        {view !== 'loading' && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setAnalyticsOpen(true)}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="History (⌘H)"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="Toggle Theme (⌘B)"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Landing onSubmit={handleSubmit} onLoading={handleLoading} />
            </motion.div>
          )}

          {view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="fixed inset-0 bg-grid opacity-50" />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial pointer-events-none" />

              <div className="relative z-10 text-center px-6 max-w-lg">
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center mx-auto mb-8 animate-pulse-glow"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold mb-2">Analyzing Your Startup</h2>
                <p className="text-gray-500 mb-2">Our AI agents are working together to evaluate your idea</p>
                {idea && (
                  <div className="px-4 py-2 rounded-lg bg-violet-600/10 border border-violet-500/20 inline-block mb-6">
                    <span className="text-sm text-violet-300 font-medium">{idea.name}</span>
                  </div>
                )}

                <div className="space-y-3 text-left">
                  {LOADING_STEPS.map((step, i) => {
                    const isActive = i === loadingStep;
                    const isComplete = i < loadingStep;
                    const Icon = step.icon;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-violet-600/10 border border-violet-500/30'
                            : isComplete
                              ? 'bg-emerald-600/10 border border-emerald-500/20'
                              : 'bg-surface-800/30 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? 'bg-violet-600/30 text-violet-400'
                            : isComplete
                              ? 'bg-emerald-600/30 text-emerald-400'
                              : 'bg-surface-700 text-gray-600'
                        }`}>
                          {isComplete ? (
                            <span className="text-sm">✓</span>
                          ) : isActive ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          isActive
                            ? 'text-violet-300 font-medium'
                            : isComplete
                              ? 'text-emerald-400'
                              : 'text-gray-600'
                        }`}>
                          {step.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <div className="w-full bg-surface-800 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Step {loadingStep + 1} of {LOADING_STEPS.length}
                  </p>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                  <div className="text-xs text-gray-500 mb-2">Multi-Agent Architecture Active</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Market Research', 'Competitor Analysis', 'Financial', 'Risk', 'Business Plan', 'Pitch Deck'].map((agent, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-full text-xs border transition-all ${
                          loadingStep >= i
                            ? 'border-violet-500/30 text-violet-300 bg-violet-600/10'
                            : 'border-surface-600 text-gray-600 bg-surface-800/30'
                        }`}
                      >
                        {agent} Agent
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && analysis && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboard analysis={analysis} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>

        <HistoryPanel
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onLoadAnalysis={handleLoadAnalysis}
        />

        {analyticsOpen && (
          <AnalyticsDashboard onClose={() => setAnalyticsOpen(false)} />
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1b2e',
              color: '#e5e7eb',
              border: '1px solid #3d3860',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
