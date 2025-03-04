import { TextInput } from '../TextInput';
import { SearchInput } from '../SearchInput';
import { SplitStrategySelect } from '../SplitStrategySelect';
import { SimilarityResults } from '../SimilarityResults';
import { ErrorDisplay } from '../ErrorDisplay';
import { ProgressSteps } from '../ProgressSteps';
import type { Step } from '../ProgressSteps';
import type { MultiStrategyResults } from '../../utils/analysis';
import type { SplitStrategy } from '../../utils/textSplitting';
import { useAppContext } from '../../context/AppContext';
import { ActionType } from '../../context/AppContext';
import { analyzeText } from '../../utils/analysis';
import type { AzureConfig } from '../../utils/config';
import { Trash2 } from 'lucide-react';

interface MainContentProps {
  text: string;
  onTextChange: (text: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  splitStrategy: SplitStrategy;
  onSplitStrategyChange: (strategy: SplitStrategy) => void;
  loading: boolean;
  error: string | null;
  results: MultiStrategyResults | null;
  steps: Step[];
  tokenCount: number;
}

export function MainContent({
  text,
  onTextChange,
  searchQuery,
  onSearchQueryChange,
  splitStrategy,
  onSplitStrategyChange,
  loading,
  error,
  results,
  steps,
  tokenCount,
}: MainContentProps) {
  
  const { dispatch, state } = useAppContext();

  const handleAnalyze = async () => {
    if (!state.text.trim()) return;
    
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      dispatch({ type: ActionType.SET_ERROR, payload: null });
      
      state.steps.forEach(step => 
        dispatch({ 
          type: ActionType.UPDATE_STEP, 
          payload: { stepId: step.id, status: 'pending' } 
        })
      );
      
      const updateStepStatus = (stepId: number, status: Step['status']) => {
        dispatch({ 
          type: ActionType.UPDATE_STEP, 
          payload: { stepId, status } 
        });
      };
      
      const res = await analyzeText(
        state.text, 
        state.searchQuery, 
        state.config as AzureConfig, 
        updateStepStatus
      );
      
      dispatch({ type: ActionType.SET_RESULTS, payload: res });
      dispatch({ type: ActionType.SET_TOKEN_COUNT, payload: res.fullTextTokenCount });
    } catch (err) {
      dispatch({ 
        type: ActionType.SET_ERROR, 
        payload: err instanceof Error ? err.message : 'An error occurred' 
      });
      
      state.steps.forEach(step => {
        if (step.status === 'active') {
          dispatch({ 
            type: ActionType.UPDATE_STEP, 
            payload: { stepId: step.id, status: 'pending' } 
          });
        }
      });
    } finally {
      dispatch({ type: ActionType.SET_LOADING, payload: false });
    }
  };

  const handleClearData = () => {
    dispatch({ type: ActionType.CLEAR_SPLIT_ANALYSIS });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200 p-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Split Text Analysis</h2>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                  title="Clear all data"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <SearchInput value={searchQuery} onChange={onSearchQueryChange} />
                <SplitStrategySelect value={splitStrategy} onChange={onSplitStrategyChange} />
              </div>
            </div>
            <div className="p-6">
              <TextInput
                value={text}
                onChange={onTextChange}
                onAnalyze={handleAnalyze}
                loading={loading}
                splitStrategy={splitStrategy}
                fullTextTokenCount={tokenCount}
              />
              <ErrorDisplay error={error} />
              <SimilarityResults
                resultsByStrategy={results}
                hasSearchQuery={Boolean(searchQuery.trim())}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Analysis Progress</h2>
            <ProgressSteps steps={steps} />
          </div>
        </div>
      </div>
    </div>
  );
}