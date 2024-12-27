import React from 'react';
import { Settings } from 'lucide-react';
import type { AzureConfig, AuthType } from '../utils/config';

interface ConfigFormProps {
  config: Partial<AzureConfig>;
  onChange: (config: AzureConfig) => void;
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  const handleAuthTypeChange = (authType: AuthType) => {
    onChange({ 
      ...config, 
      authType,
      // Clear the other auth method's value
      ...(authType === 'apiKey' ? { token: undefined } : { apiKey: undefined })
    } as AzureConfig);
  };

  return (
    <div className="space-y-6">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Authentication Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAuthTypeChange('apiKey')}
            className={`p-2 text-sm rounded-lg border ${
              config.authType === 'apiKey'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            API Key
          </button>
          <button
            onClick={() => handleAuthTypeChange('token')}
            className={`p-2 text-sm rounded-lg border ${
              config.authType === 'token'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            Azure AD Token
          </button>
        </div>
      </div>
      
      {config.authType === 'apiKey' ? (
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
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Azure AD Token
          </label>
          <input
            type="password"
            value={config.token || ''}
            onChange={(e) => onChange({ ...config, token: e.target.value } as AzureConfig)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Azure AD token"
          />
          <p className="mt-2 text-sm text-gray-500">
            To obtain an access token, run:
            <code className="block mt-1 bg-gray-100 p-2 rounded">
              az account get-access-token --resource https://cognitiveservices.azure.com/ --query accessToken --output tsv
            </code>
          </p>
        </div>
      )}
      
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
  );
}