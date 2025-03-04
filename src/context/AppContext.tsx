import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Step } from '../components/ProgressSteps';
import type { MultiStrategyResults } from '../utils/analysis';
import type { SplitStrategy } from '../utils/textSplitting';
import type { AzureConfig } from '../utils/config';
import { initialSteps } from '../components/ProgressSteps';
import { 
  loadConfig, 
  saveConfig, 
  loadSplitAnalysisData, 
  saveSplitAnalysisData,
  clearSplitAnalysisData,
  loadSimilarityMatrixData,
  saveSimilarityMatrixData,
  clearSimilarityMatrixData
} from '../utils/secureStorage';
import { getEnvConfig } from '../utils/config';
import type { TabId } from '../components/layout/TabNavigation';
import type { TextSample } from '../components/similarity-matrix/TextSampleInput';

// Define the state structure
interface AppState {
  text: string;
  searchQuery: string;
  splitStrategy: SplitStrategy;
  loading: boolean;
  error: string | null;
  resultsByStrategy: MultiStrategyResults | null;
  steps: Step[];
  fullTextTokenCount: number;
  config: Partial<AzureConfig>;
  isConfigOpen: boolean;
  activeTab: TabId;
  similarityMatrixSamples: TextSample[];
}

// Define action type constants
export const ActionType = {
  SET_TEXT: 'SET_TEXT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SPLIT_STRATEGY: 'SET_SPLIT_STRATEGY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_RESULTS: 'SET_RESULTS',
  UPDATE_STEP: 'UPDATE_STEP',
  SET_TOKEN_COUNT: 'SET_TOKEN_COUNT',
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  SET_CONFIG_OPEN: 'SET_CONFIG_OPEN',
  RESET_ANALYSIS: 'RESET_ANALYSIS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SIMILARITY_MATRIX_SAMPLES: 'SET_SIMILARITY_MATRIX_SAMPLES',
  CLEAR_SPLIT_ANALYSIS: 'CLEAR_SPLIT_ANALYSIS',
  CLEAR_SIMILARITY_MATRIX: 'CLEAR_SIMILARITY_MATRIX'
} as const;

// Define action types
type AppAction =
  | { type: typeof ActionType.SET_TEXT; payload: string }
  | { type: typeof ActionType.SET_SEARCH_QUERY; payload: string }
  | { type: typeof ActionType.SET_SPLIT_STRATEGY; payload: SplitStrategy }
  | { type: typeof ActionType.SET_LOADING; payload: boolean }
  | { type: typeof ActionType.SET_ERROR; payload: string | null }
  | { type: typeof ActionType.SET_RESULTS; payload: MultiStrategyResults }
  | { type: typeof ActionType.UPDATE_STEP; payload: { stepId: number; status: Step['status'] } }
  | { type: typeof ActionType.SET_TOKEN_COUNT; payload: number }
  | { type: typeof ActionType.UPDATE_CONFIG; payload: AzureConfig }
  | { type: typeof ActionType.SET_CONFIG_OPEN; payload: boolean }
  | { type: typeof ActionType.RESET_ANALYSIS }
  | { type: typeof ActionType.SET_ACTIVE_TAB; payload: TabId }
  | { type: typeof ActionType.SET_SIMILARITY_MATRIX_SAMPLES; payload: TextSample[] }
  | { type: typeof ActionType.CLEAR_SPLIT_ANALYSIS }
  | { type: typeof ActionType.CLEAR_SIMILARITY_MATRIX };

// Load saved data
const savedSplitAnalysisData = loadSplitAnalysisData();
const savedSimilarityMatrixData = loadSimilarityMatrixData();

// Initial state
const initialState: AppState = {
  text: savedSplitAnalysisData?.text || '',
  searchQuery: savedSplitAnalysisData?.searchQuery || '',
  splitStrategy: (savedSplitAnalysisData?.splitStrategy as SplitStrategy) || 'midpoint',
  loading: false,
  error: null,
  resultsByStrategy: null,
  steps: initialSteps,
  fullTextTokenCount: 0,
  config: loadConfig() || getEnvConfig(), 
  isConfigOpen: false,
  activeTab: 'split-analysis',
  similarityMatrixSamples: savedSimilarityMatrixData?.samples || [],
};

// Create the context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case ActionType.SET_TEXT:
      return { ...state, text: action.payload };
    case ActionType.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ActionType.SET_SPLIT_STRATEGY:
      return { ...state, splitStrategy: action.payload };
    case ActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionType.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionType.SET_RESULTS:
      return { ...state, resultsByStrategy: action.payload };
    case ActionType.UPDATE_STEP:
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload.stepId
            ? { ...step, status: action.payload.status }
            : step
        ),
      };
    case ActionType.SET_TOKEN_COUNT:
      return { ...state, fullTextTokenCount: action.payload };
    case ActionType.UPDATE_CONFIG:
      saveConfig(action.payload);
      return { ...state, config: action.payload };
    case ActionType.SET_CONFIG_OPEN:
      return { ...state, isConfigOpen: action.payload };
    case ActionType.RESET_ANALYSIS:
      return {
        ...state,
        loading: false,
        error: null,
        resultsByStrategy: null,
        steps: initialSteps,
        fullTextTokenCount: 0,
      };
    case ActionType.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    case ActionType.SET_SIMILARITY_MATRIX_SAMPLES:
      return { ...state, similarityMatrixSamples: action.payload };
    case ActionType.CLEAR_SPLIT_ANALYSIS:
      clearSplitAnalysisData();
      return {
        ...state,
        text: '',
        searchQuery: '',
        splitStrategy: 'midpoint',
        resultsByStrategy: null,
        error: null,
        fullTextTokenCount: 0,
        steps: initialSteps,
      };
    case ActionType.CLEAR_SIMILARITY_MATRIX:
      clearSimilarityMatrixData();
      return {
        ...state,
        similarityMatrixSamples: [],
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save Split Analysis data when it changes
  useEffect(() => {
    saveSplitAnalysisData({
      text: state.text,
      searchQuery: state.searchQuery,
      splitStrategy: state.splitStrategy,
    });
  }, [state.text, state.searchQuery, state.splitStrategy]);

  // Save Similarity Matrix data when it changes
  useEffect(() => {
    saveSimilarityMatrixData({
      samples: state.similarityMatrixSamples,
    });
  }, [state.similarityMatrixSamples]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}