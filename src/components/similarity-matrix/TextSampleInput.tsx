import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export interface TextSample {
  id: string;
  text: string;
}

interface TextSampleInputProps {
  samples: TextSample[];
  onAddSample: (text: string) => void;
  onRemoveSample: (id: string) => void;
  loading: boolean;
}

export function TextSampleInput({ 
  samples, 
  onAddSample, 
  onRemoveSample,
  loading
}: TextSampleInputProps) {
  const [newSample, setNewSample] = useState('');

  const handleAddSample = () => {
    if (newSample.trim()) {
      onAddSample(newSample.trim());
      setNewSample('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddSample();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Text Samples
        </label>
        <div className="flex">
          <textarea
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a text sample..."
            value={newSample}
            onChange={(e) => setNewSample(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleAddSample}
            disabled={!newSample.trim() || loading}
            className={`px-4 rounded-r-lg flex items-center justify-center
              ${!newSample.trim() || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Press Enter to add a sample. Add at least 2 samples to generate a similarity matrix.
        </p>
      </div>

      {samples.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Your Samples:</h3>
          <div className="space-y-2">
            {samples.map((sample) => (
              <div 
                key={sample.id} 
                className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 mr-2 break-words">
                  {sample.text}
                </div>
                <button
                  onClick={() => onRemoveSample(sample.id)}
                  disabled={loading}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}