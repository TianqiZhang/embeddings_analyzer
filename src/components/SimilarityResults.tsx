import React from 'react';
import type { MultiStrategyResults } from '../utils/analysis';

interface SimilarityResultsProps {
  resultsByStrategy: MultiStrategyResults | null;
  hasSearchQuery: boolean;
}

function highlightMax(values: Array<number | undefined>): number | undefined {
  const valid = values.filter((v) => v != null) as number[];
  return valid.length ? Math.max(...valid) : undefined;
}

export function SimilarityResults({ resultsByStrategy, hasSearchQuery }: SimilarityResultsProps) {
  if (!resultsByStrategy) return null;

  const { midpoint, semantic, overlap } = resultsByStrategy;

  const row1Max = highlightMax([midpoint.fullToAverage, semantic.fullToAverage, overlap.fullToAverage]);
  const row2Max = hasSearchQuery
    ? highlightMax([midpoint.queryToFull, semantic.queryToFull, overlap.queryToFull])
    : undefined;
  const row3Max = hasSearchQuery
    ? highlightMax([midpoint.queryToAverage, semantic.queryToAverage, overlap.queryToAverage])
    : undefined;

  return (
    <div className="mt-6 space-y-3">
      <h3 className="font-semibold text-lg mb-4">Similarity Scores (All Strategies):</h3>
      <div className="overflow-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-2 border"> </th>
              <th className="p-2 border">Simple Midpoint</th>
              <th className="p-2 border">Semantic (Newline)</th>
              <th className="p-2 border">Semantic + Overlapping</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">Full vs Average</td>
              <td className={row1Max === midpoint.fullToAverage ? 'p-2 border font-bold' : 'p-2 border'}>
                {midpoint.fullToAverage?.toFixed(4)}
              </td>
              <td className={row1Max === semantic.fullToAverage ? 'p-2 border font-bold' : 'p-2 border'}>
                {semantic.fullToAverage?.toFixed(4)}
              </td>
              <td className={row1Max === overlap.fullToAverage ? 'p-2 border font-bold' : 'p-2 border'}>
                {overlap.fullToAverage?.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="p-2 border">Query vs Full</td>
              <td
                className={
                  row2Max === midpoint.queryToFull ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? midpoint.queryToFull?.toFixed(4) : 'N/A'}
              </td>
              <td
                className={
                  row2Max === semantic.queryToFull ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? semantic.queryToFull?.toFixed(4) : 'N/A'}
              </td>
              <td
                className={
                  row2Max === overlap.queryToFull ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? overlap.queryToFull?.toFixed(4) : 'N/A'}
              </td>
            </tr>
            <tr>
              <td className="p-2 border">Query vs Average</td>
              <td
                className={
                  row3Max === midpoint.queryToAverage ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? midpoint.queryToAverage?.toFixed(4) : 'N/A'}
              </td>
              <td
                className={
                  row3Max === semantic.queryToAverage ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? semantic.queryToAverage?.toFixed(4) : 'N/A'}
              </td>
              <td
                className={
                  row3Max === overlap.queryToAverage ? 'p-2 border font-bold' : 'p-2 border'
                }
              >
                {hasSearchQuery ? overlap.queryToAverage?.toFixed(4) : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}