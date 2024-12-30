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
): Promise<MultiStrategyResults & { fullTextTokenCount: number }> {
  const [vectorFullData, vectorQueryData] = await Promise.all([
    (async () => {
      updateStepStatus(1, 'active');
      const data = await getEmbedding(text, config);
      updateStepStatus(1, 'completed');
      return data;
    })(),
    (async () => {
      if (searchQuery.trim()) {
        updateStepStatus(3, 'active');
        const vectorQuery = await getEmbedding(searchQuery, config);
        updateStepStatus(3, 'completed');
        return vectorQuery;
      } else {
        updateStepStatus(3, 'completed');
        return null;
      }
    })(),
  ]);

  const vectorFull = vectorFullData.embedding;
  const fullTextTokenCount = vectorFullData.tokenCount;
  const vectorQuery = vectorQueryData ? vectorQueryData.embedding : null;

  async function getStrategyResults(strategy: SplitStrategy): Promise<AnalysisResults> {
    const [partA, partB] = splitText(text, strategy);
    const [aData, bData] = await Promise.all([
      getEmbedding(partA, config),
      getEmbedding(partB, config)
    ]);
    const vectorA = aData.embedding;
    const vectorB = bData.embedding;
    const avg = averageVectors(vectorA, vectorB);
    return {
      fullToAverage: calculateCosineSimilarity(vectorFull, avg),
      queryToFull: vectorQuery
        ? calculateCosineSimilarity(vectorQuery, vectorFull)
        : undefined,
      queryToAverage: vectorQuery
        ? calculateCosineSimilarity(vectorQuery, avg)
        : undefined,
    };
  }

  updateStepStatus(2, 'active');
  const [midpointResults, semanticResults, overlapResults] = await Promise.all([
    getStrategyResults('midpoint'),
    getStrategyResults('semantic'),
    getStrategyResults('overlap'),
  ]);
  updateStepStatus(2, 'completed');

  updateStepStatus(4, 'active');
  updateStepStatus(4, 'completed');

  return {
    midpoint: midpointResults,
    semantic: semanticResults,
    overlap: overlapResults,
    fullTextTokenCount
  };
}