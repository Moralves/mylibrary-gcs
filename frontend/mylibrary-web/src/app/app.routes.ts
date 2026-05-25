import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { LoanListComponent } from './features/loans/loan-list/loan-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryListComponent },
  { path: 'books', component: BookListComponent },
  { path: 'loans', component: LoanListComponent },
  { path: '**', redirectTo: 'categories' }
];
