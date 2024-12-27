import React from 'react';
import { Brain, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenConfig: () => void;
}

export function Header({ onOpenConfig }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Text Embedding Analyzer</h1>
          </div>
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Configure</span>
          </button>
        </div>
      </div>
    </header>
  );
}