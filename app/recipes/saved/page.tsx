'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Ingredient {
  text: string;
  checked: boolean;
}

interface SavedRecipe {
  id: string;
  created_at: string;
  title: string;
  source: string;
  url: string;
  ingredients: Ingredient[];
  instructions: string[];
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  notes?: string;
}

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/saved');
      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/recipes/saved?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete recipe');

      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      alert('Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleIngredient = (recipeId: string, ingredientIndex: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              ingredients: recipe.ingredients.map((ing, idx) =>
                idx === ingredientIndex ? { ...ing, checked: !ing.checked } : ing
              ),
            }
          : recipe
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Saved Recipes</h1>
              <p className="text-gray-600">Your personal recipe collection</p>
            </div>
            <Link
              href="/recipes"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Search Recipes
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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
            <p className="mt-4 text-gray-600">Loading your saved recipes...</p>
          </div>
        )}

        {/* Saved Recipes */}
        {!loading && recipes.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {recipes.length} Saved Recipe{recipes.length !== 1 ? 's' : ''}
            </h2>
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Recipe Header */}
                <div className="mb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-4">
                      <a
                        href={recipe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {recipe.source} →
                      </a>
                      <span className="text-sm text-gray-500">
                        Saved {new Date(recipe.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    disabled={deletingId === recipe.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {deletingId === recipe.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      '🗑️ Delete'
                    )}
                  </button>
                </div>

                {/* Recipe Meta */}
                {(recipe.prep_time || recipe.cook_time || recipe.servings) && (
                  <div className="flex gap-4 mb-4 text-sm text-gray-600">
                    {recipe.prep_time && <span>⏱️ Prep: {recipe.prep_time}</span>}
                    {recipe.cook_time && <span>🔥 Cook: {recipe.cook_time}</span>}
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
                            onChange={() => toggleIngredient(recipe.id, idx)}
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

                {/* Notes */}
                {recipe.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-700">{recipe.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No saved recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start searching for recipes and save your favorites
            </p>
            <Link
              href="/recipes"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search Recipes
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
