import React, { useState } from 'react';
import type { AzureConfig } from '../utils/config';
import type { Step } from './ProgressSteps';
import type { MultiStrategyResults } from '../utils/analysis';
import type { SplitStrategy } from '../utils/textSplitting';
import { analyzeText } from '../utils/analysis';
import { ProgressSteps } from './ProgressSteps';
import { TextInput } from './TextInput';
import { SearchInput } from './SearchInput';
import { SplitStrategySelect } from './SplitStrategySelect';
import { SimilarityResults } from './SimilarityResults';
import { ErrorDisplay } from './ErrorDisplay';

const initialSteps: Step[] = [
  { id: 1, label: 'Generate full text embedding', status: 'pending' },
  { id: 2, label: 'Generate partial embeddings', status: 'pending' },
  { id: 3, label: 'Average partial embeddings', status: 'pending' },
  { id: 4, label: 'Generate search query embedding', status: 'pending' },
  { id: 5, label: 'Compute similarity scores', status: 'pending' }
];

export function TextAnalyzer({ config }: { config: AzureConfig }) {
  const [text, setText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [splitStrategy, setSplitStrategy] = useState<SplitStrategy>('midpoint');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsByStrategy, setResultsByStrategy] = useState<MultiStrategyResults | null>(null);
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const updateStepStatus = (stepId: number, status: Step['status']) => {
    setSteps(currentSteps => currentSteps.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Reset all steps
      steps.forEach(step => updateStepStatus(step.id, 'pending'));
      
      const res = await analyzeText(text, searchQuery, config, updateStepStatus);
      setResultsByStrategy(res);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      steps.forEach(step => {
        if (step.status === 'active') {
          updateStepStatus(step.id, 'pending');
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <SplitStrategySelect
            value={splitStrategy}
            onChange={setSplitStrategy}
          />
          <TextInput
            value={text}
            onChange={setText}
            onAnalyze={handleAnalyze}
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
      <div className="w-48">
        <ProgressSteps steps={steps} />
      </div>
    </div>
  );
}