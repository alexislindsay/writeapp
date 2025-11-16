import Link from "next/link";
import { posts } from "./posts";

export default function BlogPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold">Blog</h1>
      <ul className="list-disc list-inside">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
