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
  onTextChange: (text: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  splitStrategy: SplitStrategy;
  onSplitStrategyChange: (strategy: SplitStrategy) => void;
  loading: boolean;
  error: string | null;
  results: MultiStrategyResults | null;
  steps: Step[];
  onAnalyze: () => void;
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
  onAnalyze,
  tokenCount,
}: MainContentProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="border-b border-gray-200 p-6 pb-0">
              <div className="grid md:grid-cols-2 gap-6">
                <SearchInput value={searchQuery} onChange={onSearchQueryChange} />
                <SplitStrategySelect value={splitStrategy} onChange={onSplitStrategyChange} />
              </div>
            </div>
            <div className="p-6">
              <TextInput
                value={text}
                onChange={onTextChange}
                onAnalyze={onAnalyze}
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
    </main>
  );
}