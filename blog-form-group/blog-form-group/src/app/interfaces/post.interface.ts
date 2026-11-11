export interface Post {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  email: string;
  publishNow: boolean;
  publishDate: string | null;
}
