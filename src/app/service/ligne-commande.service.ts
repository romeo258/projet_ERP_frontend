import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { LigneCommande } from '../interface/ligneCommande';
import { Customer } from '../interface/customer';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CustomHttpResponse } from '../interface/appstates';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService {

  private readonly server: string = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  createLigne$ = (invoiceId: number, productId: number, ligneCommande: LigneCommande) =>
    <Observable<CustomHttpResponse<Customer[] & User>>>(
      this.http
        .post<CustomHttpResponse<Customer[] & User>>(
          `${this.server}/ligne/addto/${invoiceId}/${productId}`,
          ligneCommande
        )
        .pipe(tap(console.log), catchError(this.handleError))
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
