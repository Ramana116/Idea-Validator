// Lazy-loaded Dashboard with Code Splitting
import { lazy, Suspense, memo } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Dashboard = lazy(() => import('../Dashboard'));
const AnalyticsDashboard = lazy(() => import('../AnalyticsDashboard'));
const HistoryPanel = lazy(() => import('../HistoryPanel'));

interface LazyDashboardProps {
  analysis: any;
  onBack: () => void;
  showAnalytics: boolean;
  showHistory: boolean;
  onCloseAnalytics: () => void;
  onCloseHistory: () => void;
  onLoadAnalysis: (id: string) => void;
}

const LoadingFallback = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-surface-950">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading dashboard...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

export default memo(function LazyDashboard({
  analysis,
  onBack,
  showAnalytics,
  showHistory,
  onCloseAnalytics,
  onCloseHistory,
  onLoadAnalysis,
}: LazyDashboardProps) {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard analysis={analysis} onBack={onBack} />
      </Suspense>

      {showAnalytics && (
        <Suspense fallback={<LoadingFallback />}>
          <AnalyticsDashboard onClose={onCloseAnalytics} />
        </Suspense>
      )}

      {showHistory && (
        <Suspense fallback={null}>
          <HistoryPanel
            isOpen={showHistory}
            onClose={onCloseHistory}
            onLoadAnalysis={onLoadAnalysis}
          />
        </Suspense>
      )}
    </>
  );
});
