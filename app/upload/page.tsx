'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setFileUrl(data.url);
    } else {
      alert('Upload failed');
    }
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Upload File</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf"
          required
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
          Upload
        </button>
      </form>
      {fileUrl && (
        <div>
          <p>Uploaded:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
}
