# Recipe Finder

A web app that searches for recipes and extracts them using open-source LLMs - no more scrolling through endless blog posts to find the actual recipe!

## Features

- 🔍 **Web Search**: Searches popular recipe sites for your query
- 🤖 **LLM Extraction**: Uses open-source LLMs to extract structured recipe data
- ✅ **Ingredient Checklist**: Check off ingredients you have at home
- 🔗 **Source Links**: Direct links to original recipes
- 📱 **Clean UI**: Simple, fast interface built with Next.js

## How It Works

1. Enter what you want to cook (e.g., "egg nog", "chocolate chip cookies")
2. App searches the web and finds recipe pages
3. LLM extracts the recipe content (ingredients, instructions, times)
4. You get 3 clean recipes with checkable ingredient lists

## Setup

### Prerequisites

- Node.js 18+ and npm
- An open-source LLM (choose one):
  - **Ollama** (local, free) - recommended for getting started
  - **Together AI** (hosted, pay-as-you-go) - easier deployment

### Option 1: Using Ollama (Local)

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model: `ollama pull llama3`
3. Copy `.env.example` to `.env.local`
4. Set `LLM_PROVIDER=ollama` in `.env.local`

### Option 2: Using Together AI (Hosted)

1. Get API key from [api.together.xyz](https://api.together.xyz)
2. Copy `.env.example` to `.env.local`
3. Set `LLM_PROVIDER=together` and add your API key

### Running the App

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Configuration

See `.env.example` for all configuration options:

- `LLM_PROVIDER`: Choose 'ollama' or 'together'
- `OLLAMA_URL`: Ollama server URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model to use (default: llama3)
- `TOGETHER_API_KEY`: Your Together AI API key

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **LLM**: Ollama (Llama 3) or Together AI
- **Search**: DuckDuckGo web search
- **Deployment**: Vercel-ready

## Future Ideas

- Save favorite recipes
- Generate shopping lists
- Recipe scaling (adjust servings)
- Dietary filters (vegan, gluten-free, etc.)
- Recipe rating and notes

## License

MIT
