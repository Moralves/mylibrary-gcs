import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryListComponent },
  { path: '**', redirectTo: 'categories' }
];
