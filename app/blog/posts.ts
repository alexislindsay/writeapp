export interface Post {
  slug: string;
  title: string;
  content: string;
}

const DATA_URL = process.env.POSTS_JSON_URL ||
  'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID';

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load posts');
  }
  return res.json();
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.slug === slug);
}
