import React, { useEffect, useRef } from 'react';

interface SplitTextVisualizationProps {
  part1: string;
  part2: string;
}

export function SplitTextVisualization({ part1, part2 }: SplitTextVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitPointRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && splitPointRef.current) {
      const container = containerRef.current;
      const splitPoint = splitPointRef.current;
      
      // Calculate the position to scroll to (center the split point)
      const targetScroll = splitPoint.offsetTop - container.clientHeight / 2;
      
      container.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [part1, part2]); // Scroll when parts change

  return (
    <div 
      ref={containerRef}
      className="relative rounded-lg border border-gray-200 bg-gray-50 p-4 max-h-48 overflow-auto"
    >
      <div className="font-mono whitespace-pre-wrap text-sm">
        <span className="text-blue-600">{part1}</span>
        <span ref={splitPointRef} className="inline-block w-2 h-4 mx-0.5 bg-red-400 align-text-bottom sticky top-1/2" />
        <span className="text-green-600">{part2}</span>
      </div>
    </div>
  );
}