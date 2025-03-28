import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { HttpCacheService } from '../service/http.cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private httpCache: HttpCacheService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    if (request.url.includes('verify') || request.url.includes('login') || request.url.includes('register')
      || request.url.includes('refresh') || request.url.includes('resetpassword')
      || request.url.includes('verify') || request.url.includes('new/password') || request.url.includes('stats') ) {
      return next.handle(request);
    }
    if (request.method !== 'GET' || request.url.includes('download')) {
      this.httpCache.evictAll();
      //this.httpCache.evict(request.url);
      return next.handle(request);
    }
    const cachedResponse: HttpResponse<any> = this.httpCache.get(request.url);
    if (cachedResponse) {
      // console.log('Found Response in Cache', cachedResponse);
      this.httpCache.logCache();
      return of(cachedResponse);
    }
    return this.handleRequestCache(request, next);
  }

  private handleRequestCache(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        tap(response => {
          if (response instanceof HttpResponse && request.method !== 'DELETE') {
            // console.log('Caching Response', response);
            this.httpCache.put(request.url, response);
          }
        })
      );
  }
}
