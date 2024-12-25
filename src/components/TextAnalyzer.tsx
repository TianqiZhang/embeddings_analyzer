import React, { useState } from 'react';
import { getEmbedding, calculateCosineSimilarity, averageVectors } from '../utils/embeddings';
import type { AzureConfig } from '../utils/config';
import { ProgressSteps } from './ProgressSteps';
import type { Step } from './ProgressSteps';
import { TextInput } from './TextInput';
import { ResultDisplay } from './ResultDisplay';

export function TextAnalyzer({ config }: { config: AzureConfig }) {
  const [text, setText] = useState('');
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: 'Generate full text embedding', status: 'pending' },
    { id: 2, label: 'Generate split parts embeddings', status: 'pending' },
    { id: 3, label: 'Calculate average vector', status: 'pending' },
    { id: 4, label: 'Compute similarity score', status: 'pending' }
  ]);

  const updateStepStatus = (stepId: number, status: Step['status']) => {
    setSteps(currentSteps => currentSteps.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Generate full text embedding
      updateStepStatus(1, 'active');
      const vectorFull = await getEmbedding(text, config);
      updateStepStatus(1, 'completed');

      // Step 2: Split text and generate part embeddings
      updateStepStatus(2, 'active');
      const midpoint = Math.floor(text.length / 2);
      const part1 = text.slice(0, midpoint);
      const part2 = text.slice(midpoint);
      const vector0 = await getEmbedding(part1, config);
      const vector1 = await getEmbedding(part2, config);
      updateStepStatus(2, 'completed');

      // Step 3: Calculate average vector
      updateStepStatus(3, 'active');
      const vectorAvg = averageVectors(vector0, vector1);
      updateStepStatus(3, 'completed');

      // Step 4: Compute similarity score
      updateStepStatus(4, 'active');
      const similarityScore = calculateCosineSimilarity(vectorFull, vectorAvg);
      setSimilarity(similarityScore);
      updateStepStatus(4, 'completed');
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
          <TextInput
            value={text}
            onChange={setText}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <ResultDisplay
            similarity={similarity}
            error={error}
          />
        </div>
      </div>
      <div className="w-48">
        <ProgressSteps steps={steps} />
      </div>
    </div>
  );
}