export type SplitStrategy = 'midpoint' | 'semantic' | 'overlap';

export function splitText(text: string, strategy: SplitStrategy): [string, string] {
  const midpoint = Math.floor(text.length / 2);
  
  switch (strategy) {
    case 'midpoint':
      return [
        text.slice(0, midpoint),
        text.slice(midpoint)
      ];
      
      case 'overlap': {
        const overlapSize = Math.floor(text.length * 0.05); // 5% overlap on each side
        const splitPointStart = midpoint - overlapSize;
        const splitPointEnd = midpoint + overlapSize;
      
        // Find nearest newline before splitPointEnd
        const newlineAfter = text.lastIndexOf('\n', splitPointEnd);
        let adjustedSplitPointEnd = newlineAfter !== -1 ? newlineAfter : splitPointEnd;
      
        // Find nearest newline after splitPointStart
        const newlineBefore = text.indexOf('\n', splitPointStart);
        const adjustedSplitPointStart = newlineBefore !== -1 ? newlineBefore : splitPointStart;
        if (adjustedSplitPointEnd < adjustedSplitPointStart) {
          adjustedSplitPointEnd = adjustedSplitPointStart
        }
        return [
          text.slice(0, adjustedSplitPointEnd),
          text.slice(adjustedSplitPointStart)
        ];
      }
    
    case 'semantic': {
      const windowSize = Math.floor(text.length * 0.1);
      const searchStart = Math.max(0, midpoint - windowSize);
      const searchEnd = Math.min(text.length, midpoint + windowSize);
      const searchArea = text.slice(searchStart, searchEnd);
      
      const newlines = [...searchArea.matchAll(/\n/g)];
      
      if (newlines.length === 0) {
        return [
          text.slice(0, midpoint),
          text.slice(midpoint)
        ];
      }
      
      const relativeMiddle = midpoint - searchStart;
      const closestNewline = newlines.reduce((closest, current) => {
        const currentDistance = Math.abs(current.index! - relativeMiddle);
        const closestDistance = Math.abs(closest.index! - relativeMiddle);
        return currentDistance < closestDistance ? current : closest;
      });
      
      const splitPoint = searchStart + closestNewline.index!;
      return [
        text.slice(0, splitPoint),
        text.slice(splitPoint + 1)
      ];
    }
  }
}