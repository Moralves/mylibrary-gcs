export type BookStatus = 'AVAILABLE' | 'BORROWED';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publicationYear?: number;
  status: BookStatus;
  statusLabel: string;
  categoryId: number;
  categoryName: string;
}
