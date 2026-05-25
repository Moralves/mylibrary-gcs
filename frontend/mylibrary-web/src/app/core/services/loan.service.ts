import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Loan } from '../models/loan.model';

export interface LoanBorrowPayload {
  bookId: number;
  personName: string;
  personPhone: string;
  expectedReturnDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly baseUrl = `${environment.apiUrl}/loans`;

  constructor(private readonly http: HttpClient) {}

  public listLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl);
  }

  public listActiveLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.baseUrl}/active`);
  }

  public listBookLoans(bookId: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${environment.apiUrl}/books/${bookId}/loans`);
  }

  public borrowBook(payload: LoanBorrowPayload): Observable<Loan> {
    return this.http.post<Loan>(this.baseUrl, payload);
  }

  public returnLoan(id: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${id}/return`, {});
  }
}
