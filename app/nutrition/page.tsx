'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FoodLog {
  id: string;
  created_at: string;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes: string;
  logged_date: string;
}

export default function NutritionPage() {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const fetchFoodLogs = async () => {
    try {
      const response = await fetch('/api/nutrition');
      if (!response.ok) throw new Error('Failed to fetch food logs');
      const data = await response.json();
      setFoodLogs(data.foodLogs || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealName,
          mealType,
          calories: parseInt(calories),
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fats: parseFloat(fats) || 0,
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to log food');

      // Reset form
      setMealName('');
      setMealType('breakfast');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      setNotes('');
      setShowForm(false);

      // Refresh list
      fetchFoodLogs();
    } catch (error) {
      alert('Failed to log food');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Delete this food log?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/nutrition?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setFoodLogs(foodLogs.filter(log => log.id !== id));
    } catch (error) {
      alert('Failed to delete food log');
    } finally {
      setDeletingId(null);
    }
  };

  const todayLogs = foodLogs.filter(
    log => log.logged_date === new Date().toISOString().split('T')[0]
  );

  const todayTotals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Nutrition Tracker</h1>
              <p className="text-gray-600">Log your meals and track your macros</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Log Food'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{todayTotals.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{todayTotals.protein.toFixed(1)}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{todayTotals.carbs.toFixed(1)}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{todayTotals.fats.toFixed(1)}g</div>
              <div className="text-sm text-gray-600">Fats</div>
            </div>
          </div>
        </div>

        {/* Log Food Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Log Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name *</label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Grilled chicken with rice"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type *</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories *</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fats}
                    onChange={(e) => setFats(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional notes..."
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {submitting ? 'Logging...' : 'Log Food'}
              </button>
            </form>
          </div>
        )}

        {/* Food Log History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Log History</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : foodLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No food logs yet. Start tracking your meals!
            </div>
          ) : (
            <div className="space-y-4">
              {foodLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{log.meal_name}</h3>
                      <p className="text-sm text-gray-500">
                        {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)} • {new Date(log.logged_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteLog(log.id)}
                      disabled={deletingId === log.id}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {deletingId === log.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{log.calories}</div>
                      <div className="text-xs text-gray-500">cal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{log.protein}g</div>
                      <div className="text-xs text-gray-500">protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{log.carbs}g</div>
                      <div className="text-xs text-gray-500">carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{log.fats}g</div>
                      <div className="text-xs text-gray-500">fats</div>
                    </div>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-600 mt-3 italic">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
