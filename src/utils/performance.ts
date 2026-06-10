// Performance Monitoring & Optimization Utilities

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive
  bundleSize: number;
  memoryUsage: number;
}

export interface PerformanceEntry {
  timestamp: number;
  metric: string;
  value: number;
  delta?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private entries: PerformanceEntry[] = [];
  private observer: PerformanceObserver | null = null;

  init(): void {
    this.setupWebVitals();
    this.setupMemoryMonitoring();
    this.setupErrorMonitoring();
  }

  private setupWebVitals(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric(entry.name, entry.startTime);
        });
      });

      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported');
    }
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const mem = (performance as any).memory;
        if (mem) {
          this.recordMetric('memory-used-js-heap', mem.usedJSHeapSize);
          this.recordMetric('memory-total-js-heap', mem.totalJSHeapSize);
        }
      }, 10000);
    }
  }

  private setupErrorMonitoring(): void {
    window.addEventListener('error', (event) => {
      this.recordMetric('error', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('unhandled-rejection', 1, {
        reason: event.reason?.message || 'Unknown',
      });
    });
  }

  recordMetric(name: string, value: number, metadata?: any): void {
    const entry: PerformanceEntry = {
      timestamp: Date.now(),
      metric: name,
      value,
    };

    this.metrics.set(name, value);
    this.entries.push(entry);

    // Keep only last 100 entries
    if (this.entries.length > 100) {
      this.entries.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] ${name}:`, value, metadata);
    }
  }

  startTimer(name: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return duration;
    };
  }

  getMetrics(): PerformanceMetrics {
    return {
      fcp: this.metrics.get('first-contentful-paint') || 0,
      lcp: this.metrics.get('largest-contentful-paint') || 0,
      fid: this.metrics.get('first-input') || 0,
      cls: this.metrics.get('cumulative-layout-shift') || 0,
      tti: this.metrics.get('time-to-interactive') || 0,
      bundleSize: this.metrics.get('bundle-size') || 0,
      memoryUsage: this.metrics.get('memory-used-js-heap') || 0,
    };
  }

  getEntries(): PerformanceEntry[] {
    return this.entries;
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load component with error handling
export async function lazyLoadComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback: React.ComponentType = () => null
): Promise<React.ComponentType<T>> {
  try {
    const module = await importFn();
    return module.default;
  } catch (error) {
    console.error('Failed to load component:', error);
    return fallback as React.ComponentType<T>;
  }
}

// Image optimization
export function optimizeImage(src: string, _width = 800, _quality = 0.8): string {
  // For real implementation, use a CDN with image optimization
  // This is a placeholder for services like Cloudinary, Imgix, etc.
  return src;
}

// Cache utility with TTL
export class Cache<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Request deduplication
export class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  async request<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = fetchFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export const globalCache = new Cache();
export const requestDeduplicator = new RequestDeduplicator();
