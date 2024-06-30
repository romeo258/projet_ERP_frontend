import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, InvoiceState, Page } from '../interface/appstates';
import { Invoice } from '../interface/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  newInvoice$ = () =>
    <Observable<CustomHttpResponse<Customer[] & User>>>(
      this.http
        .get<CustomHttpResponse<Customer[] & User>>(
          `${this.server}/invoice/new`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  createInvoice$ = (customerId: number, invoice: Invoice) =>
    <Observable<CustomHttpResponse<Customer[] & User>>>(
      this.http
        .post<CustomHttpResponse<Customer[] & User>>(
          `${this.server}/invoice/addtocustomer/${customerId}`,
          invoice
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  invoices$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Invoice> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Invoice> & User>>(
          `${this.server}/invoice/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  invoice$ = (invoiceId: number) =>
    <Observable<CustomHttpResponse<Customer & Invoice & User>>>(
      this.http
        .get<CustomHttpResponse<Customer & Invoice & User>>(
          `${this.server}/invoice/get/${invoiceId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

    searchInvoices$ = (invoiceNumber: string = '', page: number = 0) =>
      <Observable<CustomHttpResponse<Page<Invoice> & User>>>(
        this.http
          .get<CustomHttpResponse<Page<Invoice> & User>>(
            `${this.server}/invoice/search?invoiceNumber=${invoiceNumber}&page=${page}`
          )
          .pipe(tap(console.log), catchError(this.handleError))
      );

      update$ = (invoice: Invoice): Observable<CustomHttpResponse<InvoiceState>> =>
        this.http
          .patch<CustomHttpResponse<InvoiceState>>(`${this.server}/invoice/update`, invoice)
          .pipe(
            tap(response => console.log(response)),
            catchError(this.handleError)
          );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `Server Not Response ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }

  deleteInvoices$ = (id: number) =>
    <Observable<any>>(
      this.http
        .delete<CustomHttpResponse<Invoice & User>>(
          `${this.server}/invoice/delete/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );
}
