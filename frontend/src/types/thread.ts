import { LastPost } from './post';

export interface Thread {
  id: number;
  name: string;
  last_post: LastPost | null;
}
