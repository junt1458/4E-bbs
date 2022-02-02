import { LastPost } from '../categoryList/interface';

export interface ThreadListProps {
  threads: Thread[];
}

export interface Thread {
  id: number;
  name: string;
  last_post: LastPost | null;
}
