import React from 'react';

interface ResultDisplayProps {
  similarity: number | null;
  error: string | null;
}

export function ResultDisplay({ similarity, error }: ResultDisplayProps) {
  return (
    <>
      {similarity !== null && (
        <div className="mt-4 text-lg">
          <span className="font-semibold">Similarity Score:</span>{' '}
          <span className="text-blue-600">{similarity.toFixed(4)}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h2 className="font-semibold mb-2">How it works:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Generates an embedding vector for the full text</li>
          <li>Splits the text into two equal parts</li>
          <li>Generates embedding vectors for each part</li>
          <li>Calculates the average of the two part vectors</li>
          <li>Computes cosine similarity between full and averaged vectors</li>
        </ol>
      </div>
    </>
  );
}