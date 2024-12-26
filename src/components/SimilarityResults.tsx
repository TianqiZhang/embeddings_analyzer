import React from 'react';

interface SimilarityResults {
  fullToAverage: number | null;
  queryToFull: number | null;
  queryToAverage: number | null;
}

interface SimilarityResultsProps {
  results: SimilarityResults;
  hasSearchQuery: boolean;
}

export function SimilarityResults({ results, hasSearchQuery }: SimilarityResultsProps) {
  if (!results.fullToAverage) return null;

  return (
    <div className="mt-6 space-y-3">
      <h3 className="font-semibold text-lg mb-4">Similarity Scores:</h3>
      
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg">
        <span className="text-gray-600">Full vs Average:</span>
        <span className="font-medium text-blue-600">{results.fullToAverage.toFixed(4)}</span>
        
        <span className="text-gray-600">Query vs Full:</span>
        <span className="font-medium text-blue-600">
          {hasSearchQuery ? results.queryToFull?.toFixed(4) : 'N/A'}
        </span>
        
        <span className="text-gray-600">Query vs Average:</span>
        <span className="font-medium text-blue-600">
          {hasSearchQuery ? results.queryToAverage?.toFixed(4) : 'N/A'}
        </span>
      </div>
      
      {hasSearchQuery && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">Analysis:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>If Query vs Full is similar to Query vs Average, it suggests splitting the text has minimal impact on search accuracy</li>
            <li>Large differences between these scores indicate that splitting affects search results</li>
          </ul>
        </div>
      )}
    </div>
  );
}