import { getEmbedding, calculateCosineSimilarity, averageVectors } from './embeddings';
import { splitText, type SplitStrategy } from './textSplitting';
import type { AzureConfig } from './config';
import type { Step } from '../components/ProgressSteps';

export interface AnalysisResults {
  fullToAverage: number | null;
  queryToFull: number | null;
  queryToAverage: number | null;
}

export async function analyzeText(
  text: string,
  searchQuery: string,
  config: AzureConfig,
  splitStrategy: SplitStrategy,
  updateStepStatus: (stepId: number, status: Step['status']) => void
): Promise<AnalysisResults> {
  // Step 1: Generate full text embedding
  updateStepStatus(1, 'active');
  const vectorFull = await getEmbedding(text, config);
  updateStepStatus(1, 'completed');

  // Step 2: Split text and generate part embeddings
  updateStepStatus(2, 'active');
  const [part1, part2] = splitText(text, splitStrategy);
  const vector0 = await getEmbedding(part1, config);
  const vector1 = await getEmbedding(part2, config);
  updateStepStatus(2, 'completed');

  // Step 3: Calculate average vector
  updateStepStatus(3, 'active');
  const vectorAvg = averageVectors(vector0, vector1);
  updateStepStatus(3, 'completed');

  // Step 4: Generate search query embedding (if exists)
  let vectorQuery = null;
  if (searchQuery.trim()) {
    updateStepStatus(4, 'active');
    vectorQuery = await getEmbedding(searchQuery, config);
    updateStepStatus(4, 'completed');
  } else {
    updateStepStatus(4, 'completed');
  }

  // Step 5: Compute similarity scores
  updateStepStatus(5, 'active');
  const fullToAverage = calculateCosineSimilarity(vectorFull, vectorAvg);
  
  let queryToFull = null;
  let queryToAverage = null;
  if (vectorQuery) {
    queryToFull = calculateCosineSimilarity(vectorQuery, vectorFull);
    queryToAverage = calculateCosineSimilarity(vectorQuery, vectorAvg);
  }
  
  updateStepStatus(5, 'completed');

  return {
    fullToAverage,
    queryToFull,
    queryToAverage,
  };
}