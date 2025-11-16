import { notFound } from "next/navigation";
import { posts } from "../posts";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
