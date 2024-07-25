import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Category } from '../interface/category';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CategoryState, CustomHttpResponse, Page } from '../interface/appstates';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  categories$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Category> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Category> & User>>(
          `${this.server}/category/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  category$ = (categoryId: number) =>
    <Observable<CustomHttpResponse<CategoryState>>>(
      this.http
        .get<CustomHttpResponse<CategoryState>>(
          `${this.server}/category/get/${categoryId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (category: Category) =>
    <Observable<CustomHttpResponse<CategoryState>>>(
      this.http
        .put<CustomHttpResponse<CategoryState>>(
          `${this.server}/category/update`,
          category
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  searchCategories$ = (name: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Category> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Category> & User>>(
          `${this.server}/category/search?name=${name}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newCategories$ = (category: Category) =>
    <Observable<CustomHttpResponse<Category & User>>>(
      this.http
        .post<CustomHttpResponse<Category & User>>(
          `${this.server}/category/create`,
          category
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteCategories$ = (id: number) =>
    <Observable<any>>(
      this.http
        .delete<CustomHttpResponse<Category & User>>(
          `${this.server}/category/delete/${id}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    // console.log(error);
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
