import React from 'react';
import { Settings } from 'lucide-react';
import type { AzureConfig } from '../utils/config';

interface ConfigFormProps {
  config: Partial<AzureConfig>;
  onChange: (config: AzureConfig) => void;
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  return (
    <div className="sticky top-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Azure OpenAI Configuration</h2>
      </div>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint
          </label>
          <input
            type="text"
            value={config.endpoint || ''}
            onChange={(e) => onChange({ ...config, endpoint: e.target.value } as AzureConfig)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://your-resource.openai.azure.com/"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => onChange({ ...config, apiKey: e.target.value } as AzureConfig)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your API key"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deployment Name
          </label>
          <input
            type="text"
            value={config.deploymentName || ''}
            onChange={(e) => onChange({ ...config, deploymentName: e.target.value } as AzureConfig)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="text-embedding-3-large"
          />
        </div>
      </div>
    </div>
  );
}