import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AgencyState, CustomHttpResponse, Page } from '../interface/appstates';
import { Agency } from '../interface/agency';
import { User } from '../interface/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  agencies$ = (page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Agency> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Agency> & User>>(
          `${this.server}/agency/list?page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  agency$ = (agencyId: number) =>
    <Observable<CustomHttpResponse<AgencyState>>>(
      this.http
        .get<CustomHttpResponse<AgencyState>>(
          `${this.server}/agency/get/${agencyId}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  update$ = (agency: Agency) =>
    <Observable<CustomHttpResponse<AgencyState>>>(
      this.http
        .put<CustomHttpResponse<AgencyState>>(
          `${this.server}/agency/update`,
          agency
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  searchAgencies$ = (name: string = '', page: number = 0) =>
    <Observable<CustomHttpResponse<Page<Agency> & User>>>(
      this.http
        .get<CustomHttpResponse<Page<Agency> & User>>(
          `${this.server}/agency/search?name=${name}&page=${page}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  newAgencies$ = (agency: Agency) =>
    <Observable<CustomHttpResponse<Agency & User>>>(
      this.http
        .post<CustomHttpResponse<Agency & User>>(
          `${this.server}/agency/create`,
          agency
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteAgencies$ = (id: number) =>
    <Observable<any>>(
      this.http
        .delete<CustomHttpResponse<Agency & User>>(
          `${this.server}/agency/delete/${id}`
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
