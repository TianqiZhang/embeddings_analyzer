import React from 'react';
import { SplitStrategy, splitText } from '../utils/textSplitting';

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
          Document Input
        </label>
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          placeholder="Paste your text here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {value && (
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="font-mono whitespace-pre-wrap text-sm">
            <span className="text-blue-600">{part1}</span>
            <span className="inline-block w-2 h-4 mx-0.5 bg-red-400 align-text-bottom" />
            <span className="text-green-600">{part2}</span>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || loading}
          className={`px-6 py-2 rounded-lg font-medium text-white 
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Go'}
        </button>
      </div>
    </div>
  );
}