import React, { useState } from 'react';
import { TextSampleInput, TextSample } from './TextSampleInput';
import { SimilarityMatrix } from './SimilarityMatrix';
import { ErrorDisplay } from '../ErrorDisplay';
import { ProgressSteps, Step } from '../ProgressSteps';
import { useAppContext } from '../../context/AppContext';
import { ActionType } from '../../context/AppContext';
import { generateSimilarityMatrix } from '../../utils/similarityMatrix';
import type { AzureConfig } from '../../utils/config';

export function SimilarityMatrixContent() {
  const { state, dispatch } = useAppContext();
  const [samples, setSamples] = useState<TextSample[]>([]);
  const [similarityScores, setSimilarityScores] = useState<number[][]>([]);
  const [matrixSteps, setMatrixSteps] = useState<Step[]>([
    { id: 1, label: 'Generate embeddings for samples', status: 'pending' },
    { id: 2, label: 'Compute similarity matrix', status: 'pending' }
  ]);
  const [matrixError, setMatrixError] = useState<string | null>(null);
  const [matrixLoading, setMatrixLoading] = useState(false);

  const handleAddSample = (text: string) => {
    setSamples([...samples, { id: Date.now().toString(), text }]);
  };

  const handleRemoveSample = (id: string) => {
    setSamples(samples.filter(sample => sample.id !== id));
    // Clear results if we remove samples
    if (similarityScores.length > 0) {
      setSimilarityScores([]);
    }
  };

  const handleGenerateMatrix = async () => {
    if (samples.length < 2) return;
    
    try {
      setMatrixLoading(true);
      setMatrixError(null);
      
      // Reset step statuses
      setMatrixSteps(steps => 
        steps.map(step => ({ ...step, status: 'pending' }))
      );
      
      const updateStepStatus = (stepId: number, status: Step['status']) => {
        setMatrixSteps(steps => 
          steps.map(step => 
            step.id === stepId ? { ...step, status } : step
          )
        );
      };
      
      const sampleTexts = samples.map(sample => sample.text);
      const matrix = await generateSimilarityMatrix(
        sampleTexts, 
        state.config as AzureConfig, 
        updateStepStatus
      );
      
      setSimilarityScores(matrix);
    } catch (err) {
      setMatrixError(err instanceof Error ? err.message : 'An error occurred');
      
      // Reset any active steps to pending
      setMatrixSteps(steps => 
        steps.map(step => 
          step.status === 'active' ? { ...step, status: 'pending' } : step
        )
      );
    } finally {
      setMatrixLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <TextSampleInput 
            samples={samples} 
            onAddSample={handleAddSample} 
            onRemoveSample={handleRemoveSample}
            loading={matrixLoading}
          />
          
          <ErrorDisplay error={matrixError} />
          
          {samples.length >= 2 && (
            <div className="mt-4">
              <button
                onClick={handleGenerateMatrix}
                disabled={samples.length < 2 || matrixLoading}
                className={`px-6 py-2 rounded-lg font-medium text-white 
                  ${samples.length < 2 || matrixLoading
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {matrixLoading ? 'Processing...' : 'Generate Similarity Matrix'}
              </button>
            </div>
          )}
          
          <SimilarityMatrix 
            samples={samples} 
            similarityScores={similarityScores} 
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
          <h2 className="text-lg font-semibold mb-4">Analysis Progress</h2>
          <ProgressSteps steps={matrixSteps} />
        </div>
      </div>
    </div>
  );
}