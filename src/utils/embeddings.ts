import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import type { AzureConfig } from "./config";

export async function getEmbedding(text: string, config: AzureConfig): Promise<number[]> {
  const client = new OpenAIClient(
    config.endpoint,
    new AzureKeyCredential(config.apiKey)
  );
  
  const result = await client.getEmbeddings(config.deploymentName, [text]);
  return result.data[0].embedding;
}

export function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

export function averageVectors(vec1: number[], vec2: number[]): number[] {
  return vec1.map((val, i) => (val + vec2[i]) / 2);
}