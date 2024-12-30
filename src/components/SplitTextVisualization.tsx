import React, { useEffect, useRef } from 'react';
import { SplitStrategy } from '../utils/textSplitting';

interface SplitTextVisualizationProps {
  part1: string;
  part2: string;
  splitStrategy: SplitStrategy;
}

export function SplitTextVisualization({ part1, part2, splitStrategy }: SplitTextVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitPointRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && splitPointRef.current) {
      const container = containerRef.current;
      const splitPoint = splitPointRef.current;
      
      const targetScroll = splitPoint.offsetTop - container.clientHeight / 2;
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [part1, part2]);

  const overlap = splitStrategy === 'overlap' ? findOverlap(part1, part2) : null;

  return (
    <div 
      ref={containerRef}
      className="relative rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-48 overflow-auto"
    >
      <div className="font-mono whitespace-pre-wrap text-sm">
        <span className="text-blue-600">
          {overlap 
            ? part1.slice(0, -overlap.length)
            : part1}
        </span>
        {overlap && (
          <span className="text-purple-600 bg-purple-100">
            {overlap}
          </span>
        )}
        <div ref={splitPointRef} className="inline-block relative">
          <div className="absolute inset-x-0 h-4 w-2 bg-red-400 mx-auto" />
          <span className="invisible px-1">{'\u200B'}</span>
        </div>
        <span className="text-green-600">
          {overlap 
            ? part2.slice(overlap.length)
            : part2}
        </span>
      </div>
    </div>
  );
}

function findOverlap(str1: string, str2: string): string | null {
  if (!str1 || !str2) return null;
  
  let overlap = '';
  const maxLength = Math.min(str1.length, str2.length);
  
  for (let i = 1; i <= maxLength; i++) {
    const end = str1.slice(-i);
    const start = str2.slice(0, i);
    if (end === start) {
      overlap = end;
    }
  }
  
  return overlap || null;
}