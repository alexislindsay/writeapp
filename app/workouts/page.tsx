'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Workout {
  id: string;
  created_at: string;
  workout_type: string;
  duration: number;
  intensity: string;
  calories_burned: number;
  notes: string;
  logged_date: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data.workouts || []);
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
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutType,
          duration: parseInt(duration),
          intensity,
          caloriesBurned: parseInt(caloriesBurned) || 0,
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to log workout');

      // Reset form
      setWorkoutType('');
      setDuration('');
      setIntensity('medium');
      setCaloriesBurned('');
      setNotes('');
      setShowForm(false);

      // Refresh list
      fetchWorkouts();
    } catch (error) {
      alert('Failed to log workout');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!confirm('Delete this workout?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/workouts?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      alert('Failed to delete workout');
    } finally {
      setDeletingId(null);
    }
  };

  const todayWorkouts = workouts.filter(
    w => w.logged_date === new Date().toISOString().split('T')[0]
  );

  const todayTotals = todayWorkouts.reduce(
    (acc, workout) => ({
      duration: acc.duration + workout.duration,
      calories: acc.calories + workout.calories_burned,
    }),
    { duration: 0, calories: 0 }
  );

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-blue-600 hover:underline text-sm mb-2 block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Tracker</h1>
              <p className="text-gray-600">Log your exercises and track your progress</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              {showForm ? 'Cancel' : '+ Log Workout'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{todayWorkouts.length}</div>
              <div className="text-sm text-gray-600">Workouts</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{todayTotals.duration} min</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{todayTotals.calories}</div>
              <div className="text-sm text-gray-600">Calories Burned</div>
            </div>
          </div>
        </div>

        {/* Log Workout Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Log Workout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workout Type *</label>
                  <input
                    type="text"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Running, Weight lifting, Yoga"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensity *</label>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                  <input
                    type="number"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="250"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Optional notes about your workout..."
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {submitting ? 'Logging...' : 'Log Workout'}
              </button>
            </form>
          </div>
        )}

        {/* Workout History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workout History</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No workouts logged yet. Start tracking your fitness!
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workout.workout_type}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(workout.logged_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      disabled={deletingId === workout.id}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {deletingId === workout.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{workout.duration} min</div>
                      <div className="text-xs text-gray-500">duration</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getIntensityColor(workout.intensity)}`}>
                      {workout.intensity.toUpperCase()}
                    </div>
                    {workout.calories_burned > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{workout.calories_burned}</div>
                        <div className="text-xs text-gray-500">calories</div>
                      </div>
                    )}
                  </div>
                  {workout.notes && (
                    <p className="text-sm text-gray-600 mt-3 italic">{workout.notes}</p>
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
