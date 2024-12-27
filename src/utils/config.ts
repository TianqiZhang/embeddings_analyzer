export type AuthType = 'apiKey' | 'token';

export interface AzureConfig {
  endpoint: string;
  deploymentName: string;
  authType: AuthType;
  apiKey?: string;
  token?: string;
}

export function getEnvConfig(): Partial<AzureConfig> {
  return {
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
    apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
    deploymentName: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME,
    authType: 'apiKey',
  };
}