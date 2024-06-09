import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Stats } from '../interface/appstates';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  stats$ = (): Observable<CustomHttpResponse<Stats>> => 
    this.http.get<CustomHttpResponse<Stats>>(`${this.server}/customer/stats`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  getStats$ = (params: any): Observable<CustomHttpResponse<Stats>> => {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return this.http.get<CustomHttpResponse<Stats>>(`${this.server}/customer/stats`, { params: httpParams })
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );
  };

  



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
