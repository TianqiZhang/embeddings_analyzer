import { AzureConfig } from './config';

const CONFIG_KEY = 'embedding-analyzer-config';
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