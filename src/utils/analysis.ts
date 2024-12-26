import { getEmbedding, calculateCosineSimilarity, averageVectors } from './embeddings';
import { splitText, type SplitStrategy } from './textSplitting';
import type { AzureConfig } from './config';
import type { Step } from '../components/ProgressSteps';

export interface AnalysisResults {
  fullToAverage: number | undefined;
  queryToFull: number | undefined;
  queryToAverage: number | undefined;
}

export interface MultiStrategyResults {
  midpoint: AnalysisResults;
  semantic: AnalysisResults;
  overlap: AnalysisResults;
}

export async function analyzeText(
  text: string,
  searchQuery: string,
  config: AzureConfig,
  updateStepStatus: (stepId: number, status: Step['status']) => void
): Promise<MultiStrategyResults> {
  // Step 1: Generate full text embedding
  updateStepStatus(1, 'active');
  const vectorFull = await getEmbedding(text, config);
  updateStepStatus(1, 'completed');

  // Step 4: Generate search query embedding (if exists)
  let vectorQuery: number[] | null = null;
  if (searchQuery.trim()) {
    updateStepStatus(4, 'active');
    vectorQuery = await getEmbedding(searchQuery, config);
    updateStepStatus(4, 'completed');
  } else {
    updateStepStatus(4, 'completed');
  }

  // New: compute results for each split strategy
  async function getStrategyResults(strategy: SplitStrategy): Promise<AnalysisResults> {
    const [partA, partB] = splitText(text, strategy);
    const vectorA = await getEmbedding(partA, config);
    const vectorB = await getEmbedding(partB, config);
    const avgEmbedding = averageVectors(vectorA, vectorB);
    return {
      fullToAverage: calculateCosineSimilarity(vectorFull, avgEmbedding),
      queryToFull: vectorQuery
        ? calculateCosineSimilarity(vectorQuery, vectorFull)
        : undefined,
      queryToAverage: vectorQuery
        ? calculateCosineSimilarity(vectorQuery, avgEmbedding)
        : undefined,
    };
  }

  // Step 2, 3, 5 combined for all strategies
  updateStepStatus(2, 'active');
  const midpointResults = await getStrategyResults('midpoint');
  const semanticResults = await getStrategyResults('semantic');
  const overlapResults = await getStrategyResults('overlap');
  updateStepStatus(2, 'completed');

  updateStepStatus(3, 'active');
  // (Partial averaging is already done inside getStrategyResults)
  updateStepStatus(3, 'completed');

  updateStepStatus(5, 'active');
  // (Cosine similarity is also computed inside getStrategyResults)
  updateStepStatus(5, 'completed');

  return {
    midpoint: midpointResults,
    semantic: semanticResults,
    overlap: overlapResults
  };
}