import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export type Step = {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
};

export const initialSteps: Step[] = [
  { id: 1, label: 'Generate full text embedding', status: 'pending' },
  { id: 2, label: 'Generate partial embeddings', status: 'pending' },
  { id: 3, label: 'Generate search query embedding', status: 'pending' },
  { id: 4, label: 'Compute similarity scores', status: 'pending' }
];

interface ProgressStepsProps {
  steps: Step[];
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2">
          {step.status === 'completed' && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          {step.status === 'active' && (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          )}
          {step.status === 'pending' && (
            <Circle className="w-5 h-5 text-gray-300" />
          )}
          <span className={`text-sm ${
            step.status === 'active' ? 'text-blue-600 font-medium' :
            step.status === 'completed' ? 'text-gray-600' :
            'text-gray-400'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}