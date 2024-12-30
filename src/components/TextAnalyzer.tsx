import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AzureConfig } from '../utils/config';
import { analyzeText } from '../utils/analysis';
import { MainContent } from './layout/MainContent';
import { ActionType } from '../context/AppContext';

export function TextAnalyzer() {
  const { state, dispatch } = useAppContext();
  
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

  return (
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
      onAnalyze={handleAnalyze}
      loading={state.loading}
      error={state.error}
      results={state.resultsByStrategy}
      steps={state.steps}
      tokenCount={state.fullTextTokenCount}
    />
  );
}