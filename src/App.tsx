import React, { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import { TextAnalyzer } from './components/TextAnalyzer';
import { getEnvConfig } from './utils/config';
import type { AzureConfig } from './utils/config';
import { Header } from './components/layout/Header';
import { ConfigDrawer } from './components/layout/ConfigDrawer';

function App() {
  const [config, setConfig] = useState<Partial<AzureConfig>>(getEnvConfig());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const isConfigured = config.endpoint && config.apiKey && config.deploymentName;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenConfig={() => setIsConfigOpen(true)} />
      
      {!isConfigured && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 p-3 rounded-lg text-yellow-700">
            Please configure your Azure OpenAI credentials to continue.
          </div>
        </div>
      )}
      
      <TextAnalyzer config={config as AzureConfig} />
      
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onChange={setConfig as (config: AzureConfig) => void}
      />
    </div>
  );
}

export default App;