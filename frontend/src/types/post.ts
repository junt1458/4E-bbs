import { User } from './user';

export interface Post {
  id: number;
  index: number;
  content: string;
  attachments: Attachment[];
  posted_at: string;
  updated_at: string;
  user: User;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
}

export interface LastPost {
  title: string;
  user_name: string;
  id: number;
  date: string;
}
