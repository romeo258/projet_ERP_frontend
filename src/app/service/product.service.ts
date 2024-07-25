import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Product } from '../interface/product';
import { CustomHttpResponse, Page, ProductState } from '../interface/appstates';
import { User } from '../interface/user';
import { Agency } from '../interface/agency';
import { Category } from '../interface/category';
import { Fournisseur } from '../interface/fournisseur';
import { CustomHttpResponseWithDataState } from '../interface/custom-http-response-with-data-state';
import { CombinedData } from '../interface/combined-data';
import { DataState } from '../enum/datastate.enum';
import { State } from '../interface/state';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  products$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Product> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Product> & User>>(
          `${this.server}/product/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  product$ = (productId: number) =>
    <Observable<CustomHttpResponse<ProductState>>>(
      this.http
        .get<CustomHttpResponse<ProductState>>(
          `${this.server}/product/get/${productId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

    update$ = (product: Product): Observable<CustomHttpResponse<ProductState>> =>
      this.http
        .patch<CustomHttpResponse<ProductState>>(`${this.server}/product/update`, product)
        .pipe(
          tap(response => console.log(response)),
          catchError(this.handleError)
        );
        
  searchProducts$ = (name: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Product> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Product> & User>>(
          `${this.server}/product/search?name=${name}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newProducts$ = (product: Product) => <Observable<CustomHttpResponse<Product & User>>>(
    this.http.post<CustomHttpResponse<Product & User>>
        (`${this.server}/product/create`, product)
        .pipe(
          tap(console.log), 
          catchError(this.handleError))
        );

  deleteProducts$ = (id: number) =>
    <Observable<any>>(
      this.http
        .delete<CustomHttpResponse<Product & User>>(
          `${this.server}/product/delete/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );


  newCatAgFou$ = (): Observable<CustomHttpResponseWithDataState<{ categories: Category[], agencies: Agency[], fournisseurs: Fournisseur[] } & User>> =>
    this.http.get<CustomHttpResponseWithDataState<{ categories: Category[], agencies: Agency[], fournisseurs: Fournisseur[] } & User>>(
      `${this.server}/product/new`
    )
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );


    createProduct$(agencyId: number, fournisseurId: number, categoryId: number, product: Product): Observable<CustomHttpResponse<CombinedData>> {
      const url = `${this.server}/product/addto/${agencyId}/${fournisseurId}/${categoryId}`;
      return this.http.post<CustomHttpResponse<CombinedData>>(url, product).pipe(
        tap(console.log),
        catchError(this.handleError)
      );
    }
    

  private handleError(error: HttpErrorResponse): Observable<never> {
    // console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        // console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
