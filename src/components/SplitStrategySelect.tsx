import React from 'react';
import { SplitStrategy } from '../utils/textSplitting';

interface SplitStrategySelectProps {
  value: SplitStrategy;
  onChange: (strategy: SplitStrategy) => void;
}

export function SplitStrategySelect({ value, onChange }: SplitStrategySelectProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Text Splitting Strategy
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SplitStrategy)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="midpoint">Simple Midpoint</option>
        <option value="semantic">Semantic (Split at Newline)</option>
      </select>
      <p className="mt-2 text-sm text-gray-500">
        {value === 'midpoint' 
          ? 'Splits text exactly in half regardless of content'
          : 'Finds the nearest newline to avoid breaking sentences'}
      </p>
    </div>
  );
}