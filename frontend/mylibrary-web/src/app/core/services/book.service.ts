import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, BookStatus } from '../models/book.model';

export interface BookCreatePayload {
  title: string;
  author: string;
  isbn?: string;
  publicationYear?: number;
  categoryId: number;
}

export interface BookFilterPayload {
  categoryId?: number;
  status?: BookStatus;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly baseUrl = `${environment.apiUrl}/books`;

  constructor(private readonly http: HttpClient) {}

  public listBooks(filters?: BookFilterPayload): Observable<Book[]> {
    let params = new HttpParams();

    if (filters?.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId.toString());
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<Book[]>(this.baseUrl, { params });
  }

  public findBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  public createBook(payload: BookCreatePayload): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, payload);
  }

  public deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
