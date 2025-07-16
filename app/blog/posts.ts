export interface Post {
  slug: string;
  title: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    content: "This is the first blog post."
  },
  {
    slug: "second-post",
    title: "Second Post",
    content: "More content goes here."
  }
];
