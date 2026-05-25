import { BookStatus } from './book.model';

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  bookStatus: BookStatus;
  bookStatusLabel: string;
  personName: string;
  personPhone: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string | null;
  active: boolean;
}
