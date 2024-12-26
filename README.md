# embeddings_analyzer

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/TianqiZhang/embeddings_analyzer)

This project aims to evaluate how splitting long document + averaging embedding vectors impact similarity results and search results.

## Usage
- `npm install`
- `npm run dev`
- Fill in your Azure OpenAI credential and deployment name (use v3 large for embedding model).
- Fill in the Document Input textbox with a very long piece of text (<8k tokens though)
- Fill in a sample search query
- Hit "Go" button.

The strategy dropdown is only for visualization. When you hit "Go" all strategies will be compared in the table.