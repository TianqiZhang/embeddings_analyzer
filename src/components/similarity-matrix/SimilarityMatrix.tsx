import React from 'react';
import { TextSample } from './TextSampleInput';

interface SimilarityMatrixProps {
  samples: TextSample[];
  similarityScores: number[][];
}

export function SimilarityMatrix({ samples, similarityScores }: SimilarityMatrixProps) {
  if (!samples.length || !similarityScores.length) return null;

  // Create abbreviated labels for the matrix
  const getAbbreviatedText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50"></th>
            {samples.map((sample, index) => (
              <th key={sample.id} className="p-2 border bg-gray-50 text-sm font-medium">
                {index + 1}. {getAbbreviatedText(sample.text)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {samples.map((sample, rowIndex) => (
            <tr key={sample.id}>
              <th className="p-2 border bg-gray-50 text-sm font-medium text-left">
                {rowIndex + 1}. {getAbbreviatedText(sample.text)}
              </th>
              {similarityScores[rowIndex]?.map((score, colIndex) => {
                // Determine cell color based on similarity score
                const bgColor = rowIndex === colIndex 
                  ? 'bg-blue-100' // Diagonal (self-comparison)
                  : score >= 0.8 
                    ? 'bg-green-100' 
                    : score >= 0.6 
                      ? 'bg-yellow-50' 
                      : 'bg-white';
                
                return (
                  <td 
                    key={`${rowIndex}-${colIndex}`} 
                    className={`p-2 border text-center ${bgColor}`}
                  >
                    {score.toFixed(4)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-gray-200 mr-2"></div>
          <span>High similarity (≥0.8)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-50 border border-gray-200 mr-2"></div>
          <span>Medium similarity (≥0.6)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-gray-200 mr-2"></div>
          <span>Self-comparison (1.0)</span>
        </div>
      </div>
    </div>
  );
}