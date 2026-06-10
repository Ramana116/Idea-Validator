// Enterprise Configuration Management

export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  analytics: {
    enabled: boolean;
    samplingRate: number;
  };
  features: {
    darkMode: boolean;
    analytics: boolean;
    export: boolean;
    collaboration: boolean;
  };
  limits: {
    maxAnalysesPerUser: number;
    maxHistoryItems: number;
    maxExportSize: number;
  };
}

const environments: Record<string, AppConfig> = {
  development: {
    env: 'development',
    api: {
      baseUrl: 'http://localhost:3000/api',
      timeout: 30000,
      retries: 3,
    },
    cache: {
      enabled: true,
      ttl: 60000, // 1 minute
      maxSize: 100,
    },
    analytics: {
      enabled: false,
      samplingRate: 1.0,
    },
    features: {
      darkMode: true,
      analytics: true,
      export: true,
      collaboration: false,
    },
    limits: {
      maxAnalysesPerUser: 100,
      maxHistoryItems: 50,
      maxExportSize: 10 * 1024 * 1024, // 10MB
    },
  },
  staging: {
    env: 'staging',
    api: {
      baseUrl: 'https://staging-api.startupvalidator.ai/api',
      timeout: 20000,
      retries: 3,
    },
    cache: {
      enabled: true,
      ttl: 300000, // 5 minutes
      maxSize: 500,
    },
    analytics: {
      enabled: true,
      samplingRate: 0.5,
    },
    features: {
      darkMode: true,
      analytics: true,
      export: true,
      collaboration: true,
    },
    limits: {
      maxAnalysesPerUser: 500,
      maxHistoryItems: 100,
      maxExportSize: 50 * 1024 * 1024, // 50MB
    },
  },
  production: {
    env: 'production',
    api: {
      baseUrl: 'https://api.startupvalidator.ai/api',
      timeout: 15000,
      retries: 2,
    },
    cache: {
      enabled: true,
      ttl: 600000, // 10 minutes
      maxSize: 1000,
    },
    analytics: {
      enabled: true,
      samplingRate: 0.1, // Sample 10% of users
    },
    features: {
      darkMode: true,
      analytics: true,
      export: true,
      collaboration: true,
    },
    limits: {
      maxAnalysesPerUser: 1000,
      maxHistoryItems: 200,
      maxExportSize: 100 * 1024 * 1024, // 100MB
    },
  },
};

export const config = environments[process.env.NODE_ENV || 'development'];

export default config;
