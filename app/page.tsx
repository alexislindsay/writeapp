'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Health & Wellness Hub</h1>
          <p className="text-gray-600 text-lg">Track your nutrition, workouts, and discover new recipes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Nutrition Tracker Card */}
          <Link href="/nutrition" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍎</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Track Food</h2>
              <p className="text-gray-600 mb-4">
                Log your meals, track calories, and monitor macros (protein, carbs, fats)
              </p>
              <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Start tracking →
              </div>
            </div>
          </Link>

          {/* Workout Tracker Card */}
          <Link href="/workouts" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-green-500">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💪</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Log Workout</h2>
              <p className="text-gray-600 mb-4">
                Record your exercises, track duration and intensity, view progress over time
              </p>
              <div className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Log exercise →
              </div>
            </div>
          </Link>

          {/* Recipe Finder Card */}
          <Link href="/recipes" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-orange-500">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Find Recipes</h2>
              <p className="text-gray-600 mb-4">
                Search for recipes, skip the blog posts, save your favorites with ingredients
              </p>
              <div className="text-orange-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Search recipes →
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Track Your Health?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 mb-1">Monitor Progress</h4>
              <p className="text-gray-600 text-sm">See your health journey over time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-1">Reach Goals</h4>
              <p className="text-gray-600 text-sm">Stay on track with your fitness targets</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌟</div>
              <h4 className="font-semibold text-gray-900 mb-1">Build Habits</h4>
              <p className="text-gray-600 text-sm">Create lasting healthy routines</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>Health & Wellness Hub - Your complete health tracking solution</p>
        </div>
      </footer>
    </div>
  );
}
