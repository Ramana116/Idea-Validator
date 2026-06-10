// Enterprise API Service with Caching, Retries, and Error Handling

import type { AnalysisResult, StartupIdea } from '../utils/mockData';
import { config } from '../config';
import { performanceMonitor, globalCache } from '../utils/performance';

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  cached: boolean;
  timestamp: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  retryable: boolean;
}

export class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private cache: Map<string, any>;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.retries = config.api.retries;
    this.cache = new Map();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
    const startTime = performance.now();

    // Check cache first
    if (useCache && config.cache.enabled) {
      const cached = globalCache.get(cacheKey);
      if (cached) {
        performanceMonitor.recordMetric('api-cache-hit', 1, { endpoint });
        return cached as ApiResponse<T>;
      }
      performanceMonitor.recordMetric('api-cache-miss', 1, { endpoint });
    }

    let lastError: ApiError | null = null;

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-ID': this.generateRequestId(),
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw {
            message: error.message || 'Request failed',
            code: error.code || 'UNKNOWN_ERROR',
            status: response.status,
            retryable: response.status >= 500 || response.status === 429,
          } as ApiError;
        }

        const data = await response.json();
        const duration = performance.now() - startTime;

        const apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          headers: response.headers,
          cached: false,
          timestamp: Date.now(),
        };

        // Cache successful GET requests
        if (useCache && config.cache.enabled && options.method !== 'POST') {
          globalCache.set(cacheKey, apiResponse);
        }

        performanceMonitor.recordMetric('api-request-success', duration, {
          endpoint,
          status: response.status,
        });

        return apiResponse;
      } catch (error: any) {
        lastError = {
          message: error.message || 'Network error',
          code: error.code || 'NETWORK_ERROR',
          status: error.status || 0,
          retryable: error.name === 'AbortError' || error.status >= 500,
        };

        performanceMonitor.recordMetric('api-request-error', 1, {
          endpoint,
          error: lastError.code,
          attempt: attempt + 1,
        });

        // Don't retry if not retryable
        if (!lastError.retryable) {
          break;
        }

        // Exponential backoff
        if (attempt < this.retries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    performanceMonitor.recordMetric('api-request-failed', 1, {
      endpoint,
      error: lastError?.code,
    });

    throw lastError;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Analysis endpoints
  async generateAnalysis(idea: StartupIdea): Promise<ApiResponse<AnalysisResult>> {
    return this.request<AnalysisResult>('/analyses', {
      method: 'POST',
      body: JSON.stringify(idea),
    }, false); // Don't cache POST requests
  }

  async getAnalysis(id: string): Promise<ApiResponse<AnalysisResult>> {
    return this.request<AnalysisResult>(`/analyses/${id}`);
  }

  async getHistory(params?: { page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.request<any>(`/analyses/history?${queryParams}`);
  }

  async exportAnalysis(id: string, format: 'pdf' | 'word' | 'json'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/analyses/${id}/export?format=${format}`, {
      headers: {
        'X-Request-ID': this.generateRequestId(),
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile');
  }

  async updateProfile(data: any): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, false);
  }

  // Analytics endpoints
  async trackEvent(event: string, properties?: any): Promise<void> {
    if (!config.analytics.enabled) return;

    // Fire and forget - don't wait for response
    this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, properties, timestamp: Date.now() }),
    }, false).catch(console.error);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.request('/health', {
        method: 'GET',
      }, false);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Clear cache
  clearCache(): void {
    globalCache.clear();
    this.cache.clear();
  }
}

export const apiService = new ApiService();
export default apiService;
