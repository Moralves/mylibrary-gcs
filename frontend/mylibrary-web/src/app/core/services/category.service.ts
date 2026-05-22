import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

export interface CategoryCreatePayload {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private readonly http: HttpClient) {}

  public listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  public createCategory(payload: CategoryCreatePayload): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, payload);
  }

  public deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
