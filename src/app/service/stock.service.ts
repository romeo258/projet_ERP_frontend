import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Stock } from '../interface/stock';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { CustomHttpResponse, Page, StockState } from '../interface/appstates';
import { User } from '../interface/user';
import { Product } from '../interface/product';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  stocks$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Stock> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Stock> & User>>(
          `${this.server}/stock/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  stock$ = (stockId: number) =>
    <Observable<CustomHttpResponse<StockState>>>(
      this.http
        .get<CustomHttpResponse<StockState>>(
          `${this.server}/stock/get/${stockId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newProducts$ = (): Observable<CustomHttpResponse<Page<Product> & User>> =>
    this.http
      .get<CustomHttpResponse<Product[] & User>>(`${this.server}/stock/new`)
      .pipe(
        tap(console.log),
        map(response => {
          const adaptedResponse: CustomHttpResponse<Page<Product> & User> = {
            ...response,
            data: {
              ...response.data,
              content: response.data as Product[], 
            }
          };
          return adaptedResponse;
        }),
        catchError(this.handleError)
      );

  searchStocks$ = (stockNumber: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Stock> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Stock> & User>>(
          `${this.server}/stock/search?stockNumber=${stockNumber}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );


// stock.service.ts
createStock$ = (productId: number, stock: Stock): Observable<CustomHttpResponse<Stock[] & User>> => 
  this.http.post<CustomHttpResponse<Stock[] & User>>
      (`${this.server}/stock/addtoproduct/${productId}`, stock)
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
        errorMessage = `Server Not Response ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
