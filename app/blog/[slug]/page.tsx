import { notFound } from 'next/navigation';
import { getPost } from '../posts';

interface Props {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
}
