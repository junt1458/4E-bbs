export interface CategoryListProps {
  categories: Category[];
}

export interface Category {
  id: number;
  title: string;
  last_post: LastPost | null;
  threads: number;
  description: string | null;
}

export interface LastPost {
  title: string;
  user_name: string;
  id: number;
  date: string;
}
