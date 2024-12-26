export type SplitStrategy = 'midpoint' | 'semantic';

export function splitText(text: string, strategy: SplitStrategy): [string, string] {
  const midpoint = Math.floor(text.length / 2);
  
  if (strategy === 'midpoint') {
    return [
      text.slice(0, midpoint),
      text.slice(midpoint)
    ];
  }
  
  // Semantic strategy: find nearest newline
  const windowSize = Math.floor(text.length * 0.1); // 10% of text length as search window
  const searchStart = Math.max(0, midpoint - windowSize);
  const searchEnd = Math.min(text.length, midpoint + windowSize);
  const searchArea = text.slice(searchStart, searchEnd);
  
  // Find all newlines in the search area
  const newlines = [...searchArea.matchAll(/\n/g)];
  
  if (newlines.length === 0) {
    // Fallback to midpoint if no newlines found
    return [
      text.slice(0, midpoint),
      text.slice(midpoint)
    ];
  }
  
  // Find the newline closest to the midpoint
  const relativeMiddle = midpoint - searchStart;
  const closestNewline = newlines.reduce((closest, current) => {
    const currentDistance = Math.abs(current.index! - relativeMiddle);
    const closestDistance = Math.abs(closest.index! - relativeMiddle);
    return currentDistance < closestDistance ? current : closest;
  });
  
  const splitPoint = searchStart + closestNewline.index!;
  
  return [
    text.slice(0, splitPoint),
    text.slice(splitPoint + 1) // Skip the newline character
  ];
}