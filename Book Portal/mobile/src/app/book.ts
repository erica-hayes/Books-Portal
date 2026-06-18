export interface Book {
  ID?: string;
  image: string;
  contact: string;
  phone: string;
  email: string;
  abstract: string;
  author: string;
  title: string;
  publish_date: string;
  category: string;
  status?: string;
  borrowedBy?: string | null;
}
