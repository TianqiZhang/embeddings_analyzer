import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { TokenCredential } from "@azure/identity";
import type { AzureConfig } from "./config";
import type { AccessToken, GetTokenOptions } from "@azure/core-auth";

class CustomTokenCredential implements TokenCredential {
  constructor(private token: string) {}

  async getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken | null> {
    return {
      token: this.token,
      expiresOnTimestamp: Date.now() + 60 * 60 * 1000 // 1 hour expiration
    };
  }
}

export async function getEmbedding(text: string, config: AzureConfig): Promise<number[]> {
  console.log('config: ', config);
  const client = new OpenAIClient(
    config.endpoint,
    config.authType === 'apiKey' 
      ? new AzureKeyCredential(config.apiKey!)
      : new CustomTokenCredential(config.token!)
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