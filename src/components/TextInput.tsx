import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function TextInput({ value, onChange, onAnalyze, loading }: TextInputProps) {
  return (
    <>
      <textarea
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Paste your text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="mt-4">
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
    </>
  );
}