import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomerState, CustomHttpResponse, Page } from '../interface/appstates';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';
import { environment } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }
  
  customers$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User>>>
        this.http.get<CustomHttpResponse<Page<Customer> & User>>
            (`${this.server}/customer/list?page=${page}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    customer$ = (customerId: number) => <Observable<CustomHttpResponse<CustomerState>>>
        this.http.get<CustomHttpResponse<CustomerState>>
            (`${this.server}/customer/get/${customerId}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    update$ = (customer: Customer) => <Observable<CustomHttpResponse<CustomerState>>>
        this.http.put<CustomHttpResponse<CustomerState>>
            (`${this.server}/customer/update`, customer)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    searchCustomers$ = (name: string = '', page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User>>>
        this.http.get<CustomHttpResponse<Page<Customer> & User>>
            (`${this.server}/customer/search?name=${name}&page=${page}`)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );

    newCustomers$ = (customer: Customer) => <Observable<CustomHttpResponse<Customer & User>>>
        this.http.post<CustomHttpResponse<Customer & User>>
            (`${this.server}/customer/create`, customer)
            .pipe(
                tap(console.log),
                catchError(this.handleError)
            );
    
    deleteCustomers$ = (id: number) => <Observable<any>>
        this.http.delete<CustomHttpResponse<Customer & User>>
            (`${this.server}/customer/delete/${id}`)
            .pipe(
                tap(console.log),
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
            errorMessage = `An error occurred - Error status ${error.status}`;
        }
    }
    return throwError(() => errorMessage);
    }
}
