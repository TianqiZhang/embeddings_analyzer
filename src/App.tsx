import React, { useState } from 'react';
import { TextAnalyzer } from './components/TextAnalyzer';
import type { AzureConfig } from './utils/config';
import { Header } from './components/layout/Header';
import { ConfigDrawer } from './components/layout/ConfigDrawer';
import { useConfig } from './hooks/useConfig';

function App() {
  const { config, updateConfig } = useConfig();
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
        onChange={updateConfig}
      />
    </div>
  );
}

export default App;