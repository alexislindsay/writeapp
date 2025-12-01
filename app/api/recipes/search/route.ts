import { NextRequest, NextResponse } from 'next/server';

// This will use web search to find recipes and extract them using LLM
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Step 1: Search for recipe URLs
    const recipeUrls = await searchRecipes(query);

    // Step 2: Extract recipe content from each URL using LLM
    const recipes = await Promise.all(
      recipeUrls.slice(0, 3).map(url => extractRecipe(url))
    );

    // Filter out any failed extractions
    const validRecipes = recipes.filter(r => r !== null);

    return NextResponse.json({ recipes: validRecipes });
  } catch (error) {
    console.error('Recipe search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}

// Search for recipe URLs using DuckDuckGo HTML scraping
async function searchRecipes(query: string): Promise<string[]> {
  try {
    // Use DuckDuckGo HTML search (no API key needed)
    const searchQuery = encodeURIComponent(`${query} recipe`);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${searchQuery}`;

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();

    // Extract URLs from DuckDuckGo results
    const urlMatches = html.matchAll(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})([^\s"'<>]*)/g);
    const urls: string[] = [];
    const seenDomains = new Set<string>();

    for (const match of urlMatches) {
      const url = match[0];
      const domain = match[1];

      // Filter for common recipe sites and avoid duplicates from same domain
      if (
        !seenDomains.has(domain) &&
        (url.includes('allrecipes') ||
          url.includes('foodnetwork') ||
          url.includes('simplyrecipes') ||
          url.includes('bonappetit') ||
          url.includes('seriouseats') ||
          url.includes('epicurious') ||
          url.includes('delish') ||
          url.includes('tasty') ||
          url.includes('food.com') ||
          url.includes('myrecipes') ||
          url.includes('bbcgoodfood'))
      ) {
        urls.push(url);
        seenDomains.add(domain);
        if (urls.length >= 5) break;
      }
    }

    // Fallback: If no popular sites found, get any recipe URLs
    if (urls.length === 0) {
      const allUrlMatches = Array.from(urlMatches).slice(0, 5);
      for (const match of allUrlMatches) {
        urls.push(match[0]);
      }
    }

    return urls;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Extract recipe from URL using LLM
async function extractRecipe(url: string) {
  try {
    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();

    // Clean HTML - remove scripts, styles, and extract text
    const cleanedText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 15000); // Limit text size for LLM

    // Get domain name for source
    const domain = new URL(url).hostname.replace('www.', '');

    // Extract recipe using LLM
    const recipe = await extractRecipeWithLLM(cleanedText, url, domain);

    return recipe;
  } catch (error) {
    console.error(`Error extracting recipe from ${url}:`, error);
    return null;
  }
}

// Use LLM to extract structured recipe data
async function extractRecipeWithLLM(text: string, url: string, source: string) {
  const llmProvider = process.env.LLM_PROVIDER || 'ollama'; // 'ollama' or 'together'

  const prompt = `Extract the recipe information from this webpage text. Return ONLY a valid JSON object with this structure:
{
  "title": "Recipe name",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "prepTime": "optional prep time",
  "cookTime": "optional cook time",
  "servings": "optional servings"
}

Webpage text:
${text.slice(0, 10000)}

Return only the JSON, no other text.`;

  try {
    let recipeData;

    if (llmProvider === 'together') {
      // Together AI API (hosted open-source models)
      const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3-8b-chat-hf',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });

      const togetherData = await togetherResponse.json();
      const content = togetherData.choices?.[0]?.message?.content || '';
      recipeData = JSON.parse(content);

    } else {
      // Ollama (local open-source models)
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
      const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'llama3',
          prompt,
          stream: false,
          format: 'json',
        }),
      });

      const ollamaData = await ollamaResponse.json();
      recipeData = JSON.parse(ollamaData.response);
    }

    // Format recipe with checkable ingredients
    return {
      title: recipeData.title || 'Untitled Recipe',
      source,
      url,
      ingredients: (recipeData.ingredients || []).map((ing: string) => ({
        text: ing,
        checked: false,
      })),
      instructions: recipeData.instructions || [],
      prepTime: recipeData.prepTime,
      cookTime: recipeData.cookTime,
      servings: recipeData.servings,
    };
  } catch (error) {
    console.error('LLM extraction error:', error);

    // Fallback: simple extraction without LLM
    return {
      title: 'Recipe',
      source,
      url,
      ingredients: [{ text: 'Visit the source for full recipe', checked: false }],
      instructions: ['Visit the source for full instructions'],
    };
  }
}
