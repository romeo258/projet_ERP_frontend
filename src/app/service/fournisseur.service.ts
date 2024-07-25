import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Fournisseur } from '../interface/fournisseur';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CustomHttpResponse, FournisseurState, Page } from '../interface/appstates';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  fournisseurs$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Fournisseur> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Fournisseur> & User>>(
          `${this.server}/fournisseur/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  fournisseur$ = (fournisseurId: number) =>
    <Observable<CustomHttpResponse<FournisseurState>>>(
      this.http
        .get<CustomHttpResponse<FournisseurState>>(
          `${this.server}/fournisseur/get/${fournisseurId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (fournisseur: Fournisseur) =>
    <Observable<CustomHttpResponse<FournisseurState>>>(
      this.http
        .put<CustomHttpResponse<FournisseurState>>(
          `${this.server}/fournisseur/update`,
          fournisseur
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  searchFournisseurs$ = (name: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Fournisseur> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Fournisseur> & User>>(
          `${this.server}/fournisseur/search?name=${name}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newFournisseurs$ = (fournisseur: Fournisseur) =>
    <Observable<CustomHttpResponse<Fournisseur & User>>>(
      this.http
        .post<CustomHttpResponse<Fournisseur & User>>(
          `${this.server}/fournisseur/create`,
          fournisseur
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteFournisseurs$ = (id: number) =>
    <Observable<any>>(
      this.http
        .delete<CustomHttpResponse<Fournisseur & User>>(
          `${this.server}/fournisseur/delete/${id}`
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
        // console.log(errorMessage);
      } else {
        errorMessage = `Server Not Response ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
