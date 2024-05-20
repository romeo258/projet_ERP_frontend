import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Page } from '../interface/appstates';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';
import { Stats } from '../interface/stats';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly server: string = 'http://192.168.56.1:8080';

  constructor(private http: HttpClient) { }
  
  customers$ = (page: number = 0) => <Observable<CustomHttpResponse<Page<Customer> & User & Stats>>>
        this.http.get<CustomHttpResponse<Page<Customer> & User & Stats>>
            (`${this.server}/customer/list?page=${page}`)
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
