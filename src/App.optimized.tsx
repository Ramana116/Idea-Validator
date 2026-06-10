import { useState, useCallback, useEffect, lazy, Suspense, memo } from 'react';
import { Toaster } from 'react-hot-toast';
import { Brain, Loader2, Sparkles, Zap, ArrowRight, History, Moon, Sun, BarChart3 } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { performanceMonitor, debounce } from './utils/performance';
import { saveAnalysisAsync, getAnalysisById } from './utils/optimizedStorage';
import { generateAnalysis, type StartupIdea, type AnalysisResult } from './utils/mockData';

// Lazy load heavy components
const Landing = lazy(() => import('./components/Landing'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const HistoryPanel = lazy(() => import('./components/HistoryPanel'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));

type AppView = 'landing' | 'loading' | 'dashboard';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<AppView>('landing');
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Initialize performance monitoring
  useEffect(() => {
    performanceMonitor.init();
    const stopTimer = performanceMonitor.startTimer('app-initialization');
    
    return () => {
      const duration = stopTimer();
      console.log(`App initialized in ${duration.toFixed(2)}ms`);
    };
  }, []);

  const LOADING_STEPS = [
    { text: 'Analyzing startup idea...', icon: Brain },
    { text: 'Researching market demand...', icon: Sparkles },
    { text: 'Identifying competitors...', icon: Zap },
    { text: 'Calculating revenue projections...', icon: ArrowRight },
    { text: 'Generating business plan...', icon: Loader2 },
    { text: 'Preparing your report...', icon: Loader2 },
  ];

  // Keyboard shortcuts with proper cleanup
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

  // Cleanup function for intervals
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (view === 'loading') {
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= LOADING_STEPS.length - 1) {
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  const handleLoading = useCallback((newIdea: StartupIdea) => {
    setIdea(newIdea);
    setView('loading');
    setLoadingStep(0);
    performanceMonitor.recordMetric('analysis-started', 1);
  }, []);

  // Debounced submit handler to prevent rapid submissions
  const handleSubmit = useCallback(
    debounce((newIdea: StartupIdea) => {
      const stopTimer = performanceMonitor.startTimer('analysis-generation');
      
      setIdea(newIdea);
      const result = generateAnalysis(newIdea);
      setAnalysis(result);
      setView('dashboard');
      
      // Async save to avoid blocking
      saveAnalysisAsync(result).catch(console.error);
      
      const duration = stopTimer();
      performanceMonitor.recordMetric('analysis-completed', duration);
    }, 300),
    []
  );

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
      performanceMonitor.recordMetric('history-load', 1);
    }
  }, []);

  // Memoized loading content to prevent re-renders
  const LoadingContent = memo(() => (
    <div className="fixed inset-0 bg-grid opacity-50" />
  ));
  LoadingContent.displayName = 'LoadingContent';

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        performanceMonitor.recordMetric('error', 1, {
          message: error.message,
          component: errorInfo.componentStack,
        });
      }}
    >
      <div className="min-h-screen bg-surface-950 text-white">
        {view !== 'loading' && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
            <button
              onClick={() => setAnalyticsOpen(true)}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="Analytics"
              aria-label="Open analytics dashboard"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="History (⌘H)"
              aria-label="Open history panel"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-800/80 backdrop-blur border border-surface-700 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all"
              title="Toggle Theme (⌘B)"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}

        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-950">
              <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
            </div>
          }
        >
          {view === 'landing' && (
            <Landing onSubmit={handleSubmit} onLoading={handleLoading} />
          )}

          {view === 'loading' && (
            <div className="min-h-screen flex items-center justify-center relative">
              <LoadingContent />
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial pointer-events-none" />

              <div className="relative z-10 text-center px-6 max-w-lg">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>

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
                      <div
                        key={i}
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
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <div className="w-full bg-surface-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 transition-all duration-500"
                      style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
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
            </div>
          )}

          {view === 'dashboard' && analysis && (
            <Dashboard analysis={analysis} onBack={handleBack} />
          )}
        </Suspense>

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
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
