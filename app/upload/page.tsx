'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Article {
  title: string;
  content: string;
  contentType: 'html' | 'pdf';
  filename: string;
  createdAt: string;
}

export default function UploadPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok && data.success) {
        const newArticle: Article = {
          title: data.title,
          content: data.content,
          contentType: data.contentType || 'html',
          filename: data.filename,
          createdAt: new Date().toISOString()
        };

        setArticle(newArticle);

        // Save to localStorage for portfolio
        const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
        savedArticles.unshift(newArticle);
        localStorage.setItem('articles', JSON.stringify(savedArticles));

        // Reset form
        e.currentTarget.reset();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Upload Writing</h1>
            <Link href="/" className="text-blue-600 hover:underline">
              View Portfolio
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Leave blank to use filename"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Document (TXT, MD, DOCX, or PDF)
              </label>
              <input
                type="file"
                name="file"
                id="file"
                accept=".txt,.md,.docx,.pdf,text/plain,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: Text, Markdown, Word, or PDF (preserves images and formatting)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Upload & Extract'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {article && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h2>
              <p className="text-sm text-gray-500">
                Uploaded {new Date(article.createdAt).toLocaleDateString()} from {article.filename}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {article.contentType === 'pdf' ? (
                <iframe
                  src={`data:application/pdf;base64,${article.content}`}
                  className="w-full h-[800px] border-0"
                  title={article.title}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-green-600 font-medium">
                Article saved to your portfolio
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
