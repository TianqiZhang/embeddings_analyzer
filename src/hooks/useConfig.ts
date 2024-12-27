import { useState, useEffect, useCallback } from 'react';
import type { AzureConfig } from '../utils/config';
import { loadConfig, saveConfig } from '../utils/secureStorage';
import { getEnvConfig } from '../utils/config';

export function useConfig() {
  const [config, setConfig] = useState<Partial<AzureConfig>>(() => {
    // Try to load from storage first, fall back to env config
    return loadConfig() || getEnvConfig();
  });

  const updateConfig = useCallback((newConfig: AzureConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, []);

  return {
    config,
    updateConfig,
  };
}