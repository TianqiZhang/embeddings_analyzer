import { MainContent } from './components/layout/MainContent';
import { Header } from './components/layout/Header';
import { ConfigDrawer } from './components/layout/ConfigDrawer';
import { TabNavigation } from './components/layout/TabNavigation';
import { SimilarityMatrixContent } from './components/similarity-matrix/SimilarityMatrixContent';
import { useAppContext } from './context/AppContext';
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
      
      <TabNavigation 
        activeTab={state.activeTab}
        onTabChange={(tab) => dispatch({ type: ActionType.SET_ACTIVE_TAB, payload: tab })}
      />
      
      <div className="py-8">
        {state.activeTab === 'split-analysis' ? (
          <MainContent
            text={state.text}
            onTextChange={(text) => dispatch({ type: ActionType.SET_TEXT, payload: text })}
            searchQuery={state.searchQuery}
            onSearchQueryChange={(query) => 
              dispatch({ type: ActionType.SET_SEARCH_QUERY, payload: query })
            }
            splitStrategy={state.splitStrategy}
            onSplitStrategyChange={(strategy) => 
              dispatch({ type: ActionType.SET_SPLIT_STRATEGY, payload: strategy })
            }
            loading={state.loading}
            error={state.error}
            results={state.resultsByStrategy}
            steps={state.steps}
            tokenCount={state.fullTextTokenCount}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SimilarityMatrixContent />
          </div>
        )}
      </div>
      
      <ConfigDrawer
        isOpen={state.isConfigOpen}
        onClose={() => dispatch({ type: ActionType.SET_CONFIG_OPEN, payload: false })}
        config={state.config}
        onChange={(newConfig) => dispatch({ type: ActionType.UPDATE_CONFIG, payload: newConfig })}
      />
    </div>
  );
}

export default AppContent;