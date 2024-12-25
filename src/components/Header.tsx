import React from 'react';
import { Brain } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Brain className="w-8 h-8 text-blue-600" />
      <h1 className="text-3xl font-bold text-gray-800">Text Embedding Analyzer</h1>
    </div>
  );
}