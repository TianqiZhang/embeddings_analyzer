import React from 'react';
import { TextAnalyzer } from './components/TextAnalyzer';
import { Header } from './components/layout/Header';
import { ConfigDrawer } from './components/layout/ConfigDrawer';
import { AppProvider, useAppContext } from './context/AppContext';
import { ActionType } from './context/AppContext';

function AppContent() {
  const { state, dispatch } = useAppContext();
  
  const isConfigured = state.config.endpoint && 
    state.config.deploymentName && 
    ((state.config.authType === 'apiKey' && state.config.apiKey) || 
     (state.config.authType === 'token' && state.config.token));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onOpenConfig={() => dispatch({ type: ActionType.SET_CONFIG_OPEN, payload: true })} 
      />
      
      {!isConfigured && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 p-3 rounded-lg text-yellow-700">
            Please configure your Azure OpenAI credentials to continue.
          </div>
        </div>
      )}
      
      <TextAnalyzer />
      
      <ConfigDrawer
        isOpen={state.isConfigOpen}
        onClose={() => dispatch({ type: ActionType.SET_CONFIG_OPEN, payload: false })}
        config={state.config}
        onChange={(newConfig) => dispatch({ type: ActionType.UPDATE_CONFIG, payload: newConfig })}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;