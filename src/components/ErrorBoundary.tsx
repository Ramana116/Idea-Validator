// Error Boundary for Crash Prevention
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 rounded-lg bg-surface-800 text-left">
                <div className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-800 text-gray-300 font-medium hover:bg-surface-700 transition-colors"
              >
                Go Back
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 pt-6 border-t border-surface-800">
                <details className="text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer flex items-center gap-2">
                    <Bug className="w-3 h-3" />
                    Technical Details (Dev Only)
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 font-mono overflow-auto max-h-48">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
