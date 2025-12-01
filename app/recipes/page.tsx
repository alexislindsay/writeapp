'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Ingredient {
  text: string;
  checked: boolean;
}

interface Recipe {
  title: string;
  source: string;
  url: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
}

export default function RecipesPage() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const response = await fetch('/api/recipes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (recipeIndex: number, ingredientIndex: number) => {
    setRecipes(prevRecipes => {
      const newRecipes = [...prevRecipes];
      newRecipes[recipeIndex].ingredients[ingredientIndex].checked =
        !newRecipes[recipeIndex].ingredients[ingredientIndex].checked;
      return newRecipes;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipe Finder</h1>
          <p className="text-gray-600">Skip the blog posts, get straight to the recipe</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What recipe are you looking for? (e.g., egg nog, chocolate chip cookies)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for recipes and extracting content...</p>
          </div>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
            </h2>
            {recipes.map((recipe, recipeIdx) => (
              <div key={recipeIdx} className="bg-white rounded-lg shadow-md p-6">
                {/* Recipe Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                  <a
                    href={recipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {recipe.source} →
                  </a>
                </div>

                {/* Recipe Meta */}
                {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                  <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    {recipe.prepTime && <span>⏱️ Prep: {recipe.prepTime}</span>}
                    {recipe.cookTime && <span>🔥 Cook: {recipe.cookTime}</span>}
                    {recipe.servings && <span>🍽️ Servings: {recipe.servings}</span>}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
                    <div className="space-y-2">
                      {recipe.ingredients.map((ingredient, idx) => (
                        <label
                          key={idx}
                          className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={ingredient.checked}
                            onChange={() => toggleIngredient(recipeIdx, idx)}
                            className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className={ingredient.checked ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {ingredient.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                    <ol className="space-y-2 list-decimal list-inside text-gray-700">
                      {recipe.instructions.map((instruction, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Search for a recipe to get started
            </h3>
            <p className="text-gray-600">
              We'll find recipes and extract the important parts for you
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
