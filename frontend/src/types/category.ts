import { LastPost } from './post';

export interface Category {
  id: number;
  title: string;
  last_post: LastPost | null;
  threads: number;
  description: string | null;
  rank: number;
}
