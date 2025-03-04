import { AzureConfig } from './config';

const CONFIG_KEY = 'embedding-analyzer-config';
const SPLIT_ANALYSIS_KEY = 'embedding-analyzer-split-analysis';
const SIMILARITY_MATRIX_KEY = 'embedding-analyzer-similarity-matrix';
const STORAGE_VERSION = '1';

// Simple encryption using XOR with a unique key per domain
function encrypt(data: string): string {
  const key = window.location.origin;
  return Array.from(data).map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
  ).join('');
}

function decrypt(data: string): string {
  return encrypt(data); // XOR is reversible with the same key
}

export function saveConfig(config: Partial<AzureConfig>): void {
  try {
    const data = JSON.stringify({
      version: STORAGE_VERSION,
      config,
      timestamp: Date.now(),
    });
    const encrypted = encrypt(data);
    localStorage.setItem(CONFIG_KEY, encrypted);
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

export function loadConfig(): Partial<AzureConfig> | null {
  try {
    const encrypted = localStorage.getItem(CONFIG_KEY);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted);
    const data = JSON.parse(decrypted);
    
    if (data.version !== STORAGE_VERSION) {
      localStorage.removeItem(CONFIG_KEY);
      return null;
    }

    return data.config;
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
}

export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

// Generic data storage functions
export function saveData<T>(key: string, data: T): void {
  try {
    const wrappedData = {
      version: STORAGE_VERSION,
      data,
      timestamp: Date.now(),
    };
    const encrypted = encrypt(JSON.stringify(wrappedData));
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

export function loadData<T>(key: string): T | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted);
    const parsed = JSON.parse(decrypted);
    
    if (parsed.version !== STORAGE_VERSION) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data as T;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
}

export function clearData(key: string): void {
  localStorage.removeItem(key);
}

// Split Analysis specific functions
export interface SplitAnalysisData {
  text: string;
  searchQuery: string;
  splitStrategy: string;
}

export function saveSplitAnalysisData(data: SplitAnalysisData): void {
  saveData(SPLIT_ANALYSIS_KEY, data);
}

export function loadSplitAnalysisData(): SplitAnalysisData | null {
  return loadData<SplitAnalysisData>(SPLIT_ANALYSIS_KEY);
}

export function clearSplitAnalysisData(): void {
  clearData(SPLIT_ANALYSIS_KEY);
}

// Similarity Matrix specific functions
export interface SimilarityMatrixData {
  samples: Array<{id: string, text: string}>;
}

export function saveSimilarityMatrixData(data: SimilarityMatrixData): void {
  saveData(SIMILARITY_MATRIX_KEY, data);
}

export function loadSimilarityMatrixData(): SimilarityMatrixData | null {
  return loadData<SimilarityMatrixData>(SIMILARITY_MATRIX_KEY);
}

export function clearSimilarityMatrixData(): void {
  clearData(SIMILARITY_MATRIX_KEY);
}