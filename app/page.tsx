import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to WriteApp</h1>
      <ul className="list-disc list-inside">
        <li>
          <Link href="/blog">View Blog</Link>
        </li>
        <li>
          <Link href="/upload">Upload a File</Link>
        </li>
      </ul>
    </div>
  );
}
