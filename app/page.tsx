import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to WriteApp</h1>
      <nav className="space-y-4">
        <div>
          <Link href="/blog" className="text-blue-600 hover:underline text-xl">
            Visit Blog
          </Link>
        </div>
        <div>
          <Link href="/upload" className="text-blue-600 hover:underline text-xl">
            Upload Files
          </Link>
        </div>
      </nav>
    </div>
  )
}
