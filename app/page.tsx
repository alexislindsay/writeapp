'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Article {
  title: string;
  content: string;
  filename: string;
  createdAt: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    setArticles(savedArticles);
  }, []);

  const getPreview = (content: string, length: number = 200) => {
    const preview = content.slice(0, length);
    return preview.length < content.length ? preview + '...' : preview;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Butterfiles</h1>
          <p className="text-gray-600">A portfolio of my writing</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {articles.length === 0 ? 'No articles yet' : `${articles.length} Article${articles.length !== 1 ? 's' : ''}`}
          </h2>
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upload New Writing
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Butterfiles</h3>
            <p className="text-gray-600 mb-6">
              Upload your first document to start building your writing portfolio
            </p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {articles.map((article, idx) => (
              <article
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {getPreview(article.content)}
                </p>
                <button
                  onClick={() => {
                    const modal = document.getElementById(`modal-${idx}`);
                    if (modal) modal.classList.remove('hidden');
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read full article →
                </button>

                {/* Modal for full article */}
                <div
                  id={`modal-${idx}`}
                  className="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      e.currentTarget.classList.add('hidden');
                    }
                  }}
                >
                  <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                    <button
                      onClick={() => {
                        const modal = document.getElementById(`modal-${idx}`);
                        if (modal) modal.classList.add('hidden');
                      }}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      {new Date(article.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="prose prose-lg max-w-none">
                      {article.content.split('\n\n').map((paragraph, pIdx) => (
                        paragraph.trim() && (
                          <p key={pIdx} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 py-8 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>Butterfiles - A simple writing portfolio</p>
        </div>
      </footer>
    </div>
  );
}
