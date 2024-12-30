# embeddings_analyzer

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/TianqiZhang/embeddings_analyzer)

## Overview
This repository illustrates how segmenting lengthy documents and averaging their embedding vectors can affect similarity scores and search outcomes when using Azure OpenAI models.

## Usage
- `npm install`
- `npm run dev`
- Provide your Azure OpenAI credentials (including the deployment name for a v3 large embedding model).
- Enter a lengthy text snippet (under 8k tokens).
- Enter a sample search query.
- Click “Go.”

The strategy dropdown is for visualization only—when you select “Go,” all strategies are evaluated and displayed side by side in the results table.