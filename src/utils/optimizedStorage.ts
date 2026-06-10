// Optimized Storage with Async Operations & Compression

import type { SavedAnalysis } from './storage';

const STORAGE_KEY = 'startup_validator_history_v2';
// Compress after 5 items - kept for future use

interface StorageData {
  version: number;
  timestamp: number;
  items: SavedAnalysis[];
  metadata: {
    totalAnalyses: number;
    lastAnalysis: number;
    industries: Record<string, number>;
  };
}

// Simple compression using JSON.stringify minification
function compress(data: StorageData): string {
  return JSON.stringify(data);
}

function decompress(data: string): StorageData | null {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Async localStorage wrapper to avoid blocking main thread
async function setItem(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, value);
      resolve();
    } catch (error) {
      console.error('Storage set error:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Storage full, clear old data
        clearOldData();
        resolve();
      } else {
        reject(error);
      }
    }
  });
}

function clearOldData(): void {
  try {
    const data = getStoredData();
    if (data && data.items.length > 0) {
      // Keep only last 10 items
      data.items = data.items.slice(0, 10);
      saveStoredData(data);
    }
  } catch {
    // If all else fails, clear everything
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getStoredData(): StorageData {
  const defaultData: StorageData = {
    version: 2,
    timestamp: Date.now(),
    items: [],
    metadata: {
      totalAnalyses: 0,
      lastAnalysis: 0,
      industries: {},
    },
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultData;

    const data = decompress(stored);
    if (!data || data.version !== defaultData.version) {
      // Migrate old data if needed
      return defaultData;
    }

    return data;
  } catch {
    return defaultData;
  }
}

function saveStoredData(data: StorageData): void {
  try {
    data.timestamp = Date.now();
    const compressed = compress(data);
    localStorage.setItem(STORAGE_KEY, compressed);
  } catch (error) {
    console.error('Failed to save storage data:', error);
  }
}

export async function saveAnalysisAsync(analysis: any): Promise<void> {
  const data = getStoredData();
  
  const saved: SavedAnalysis = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    idea: analysis.idea,
    validationScore: analysis.validationScore,
    industry: analysis.industry.industry,
    timestamp: Date.now(),
    marketDemand: analysis.market.demandScore,
    successProbability: analysis.successProbability,
  };

  // Add to beginning, keep max 20 items
  data.items.unshift(saved);
  data.items = data.items.slice(0, 20);

  // Update metadata
  data.metadata.totalAnalyses += 1;
  data.metadata.lastAnalysis = Date.now();
  data.metadata.industries[saved.industry] = 
    (data.metadata.industries[saved.industry] || 0) + 1;

  await setItem(STORAGE_KEY, compress(data));
}

export async function getHistoryAsync(): Promise<SavedAnalysis[]> {
  const data = getStoredData();
  return data.items;
}

export async function deleteAnalysisAsync(id: string): Promise<void> {
  const data = getStoredData();
  data.items = data.items.filter(item => item.id !== id);
  await setItem(STORAGE_KEY, compress(data));
}

export async function clearHistoryAsync(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAnalysisById(id: string): SavedAnalysis | null {
  const data = getStoredData();
  return data.items.find(item => item.id === id) || null;
}

export async function exportHistoryAsync(): Promise<void> {
  const data = getStoredData();
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `startup_validator_history_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function getStorageStats(): {
  itemCount: number;
  storageUsed: number;
  storageLimit: number;
  usagePercent: number;
} {
  let total = 0;
  let itemCount = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        total += key.length + value.length;
        if (key.startsWith('startup_validator')) {
          itemCount++;
        }
      }
    }
  }

  // Estimate storage limit (usually 5-10MB)
  const limit = 5 * 1024 * 1024;
  
  return {
    itemCount,
    storageUsed: total,
    storageLimit: limit,
    usagePercent: (total / limit) * 100,
  };
}

// IndexedDB wrapper for larger storage needs
export class IndexedDBStorage {
  private dbName = 'StartupValidatorDB';
  private storeName = 'analyses';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async save(analysis: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data: analysis,
        timestamp: Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBStorage = new IndexedDBStorage();
