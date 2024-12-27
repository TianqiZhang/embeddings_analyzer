import React from 'react';
import { TextInput } from '../TextInput';
import { SearchInput } from '../SearchInput';
import { SplitStrategySelect } from '../SplitStrategySelect';
import { SimilarityResults } from '../SimilarityResults';
import { ErrorDisplay } from '../ErrorDisplay';
import { ProgressSteps } from '../ProgressSteps';
import type { Step } from '../ProgressSteps';
import type { MultiStrategyResults } from '../../utils/analysis';
import type { SplitStrategy } from '../../utils/textSplitting';

interface MainContentProps {
  text: string;
  setText: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  splitStrategy: SplitStrategy;
  setSplitStrategy: (strategy: SplitStrategy) => void;
  loading: boolean;
  error: string | null;
  resultsByStrategy: MultiStrategyResults | null;
  steps: Step[];
  onAnalyze: () => void;
}

export function MainContent({
  text,
  setText,
  searchQuery,
  setSearchQuery,
  splitStrategy,
  setSplitStrategy,
  loading,
  error,
  resultsByStrategy,
  steps,
  onAnalyze,
}: MainContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200 p-6 pb-0">
              <div className="grid md:grid-cols-2 gap-6">
                <SearchInput value={searchQuery} onChange={setSearchQuery} />
                <SplitStrategySelect value={splitStrategy} onChange={setSplitStrategy} />
              </div>
            </div>
            <div className="p-6">
              <TextInput
                value={text}
                onChange={setText}
                onAnalyze={onAnalyze}
                loading={loading}
                splitStrategy={splitStrategy}
              />
              <ErrorDisplay error={error} />
              <SimilarityResults
                resultsByStrategy={resultsByStrategy}
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
    </main>
  );
}