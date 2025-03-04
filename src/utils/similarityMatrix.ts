import { getEmbedding, calculateCosineSimilarity } from './embeddings';
import type { AzureConfig } from './config';
import type { Step } from '../components/ProgressSteps';

export async function generateSimilarityMatrix(
  texts: string[],
  config: AzureConfig,
  updateStepStatus: (stepId: number, status: Step['status']) => void
): Promise<number[][]> {
  if (texts.length < 2) {
    throw new Error('At least 2 text samples are required');
  }

  // Step 1: Generate embeddings for all texts
  updateStepStatus(1, 'active');
  const embeddings: number[][] = [];
  
  try {
    for (const text of texts) {
      const result = await getEmbedding(text, config);
      embeddings.push(result.embedding);
    }
    updateStepStatus(1, 'completed');
  } catch (error) {
    updateStepStatus(1, 'pending');
    throw error;
  }

  // Step 2: Compute similarity matrix
  updateStepStatus(2, 'active');
  const similarityMatrix: number[][] = [];
  
  try {
    for (let i = 0; i < embeddings.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < embeddings.length; j++) {
        const similarity = calculateCosineSimilarity(embeddings[i], embeddings[j]);
        row.push(similarity);
      }
      similarityMatrix.push(row);
    }
    updateStepStatus(2, 'completed');
  } catch (error) {
    updateStepStatus(2, 'pending');
    throw error;
  }

  return similarityMatrix;
}