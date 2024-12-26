import React from 'react';
import { SplitStrategy, splitText } from '../utils/textSplitting';
import { SplitTextVisualization } from './SplitTextVisualization';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  splitStrategy: SplitStrategy;
}

export function TextInput({ value, onChange, onAnalyze, loading, splitStrategy }: TextInputProps) {
  const [part1, part2] = value ? splitText(value, splitStrategy) : ['', ''];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Input <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="Paste your text here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {value && <SplitTextVisualization part1={part1} part2={part2} splitStrategy={splitStrategy} />}

      <div>
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || loading}
          className={`px-6 py-2 rounded-lg font-medium text-white 
            ${!value.trim() || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Go'}
        </button>
      </div>
    </div>
  );
}