import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, throwError, filter, take } from 'rxjs';
import { Key } from '../enum/key.enum';
import { UserService } from '../service/user.service';
import { CustomHttpResponse, Profile } from '../interface/appstates';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('verify') || request.url.includes('login') || request.url.includes('register') 
        || request.url.includes('refresh') || request.url.includes('resetpassword')) {
      return next.handle(request);
    }
    const token = localStorage.getItem(Key.TOKEN);
    return next.handle(this.addAuthorizationTokenHeader(request, token))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && error.error.reason.includes('expired')) {
            return this.handleRefreshToken(request, next);
          } else {
            return throwError(() => error);
          }
        })
      );
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken$().pipe(
        switchMap((response) => {
          this.isTokenRefreshing = false;
          const newToken = response.data.access_token;
          localStorage.setItem(Key.TOKEN, newToken);
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addAuthorizationTokenHeader(request, newToken));
        }),
        catchError((error) => {
          this.isTokenRefreshing = false;
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addAuthorizationTokenHeader(request, token as string)))
      );
    }
  }

  private addAuthorizationTokenHeader(request: HttpRequest<unknown>, token: string | null): HttpRequest<any> {
    if (token) {
      return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return request;
  }
}
