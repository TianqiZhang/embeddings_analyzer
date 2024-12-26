import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
      {error}
    </div>
  );
}