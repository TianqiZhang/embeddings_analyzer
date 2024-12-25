import React, { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import { TextAnalyzer } from './components/TextAnalyzer';
import { getEnvConfig } from './utils/config';
import type { AzureConfig } from './utils/config';
import { Header } from './components/Header';

function App() {
  const [config, setConfig] = useState<Partial<AzureConfig>>(getEnvConfig());
  const isConfigured = config.endpoint && config.apiKey && config.deploymentName;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="flex gap-8">
        <div className="flex-1 max-w-3xl">
          <Header />
          {isConfigured ? (
            <TextAnalyzer config={config as AzureConfig} />
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
              Please configure your Azure OpenAI credentials to continue.
            </div>
          )}
        </div>
        <div className="w-80 flex-shrink-0">
          <ConfigForm config={config} onChange={setConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;