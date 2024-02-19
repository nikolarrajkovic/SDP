import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private token: string;
  private refreshToken: string;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    if (this.token) {
      const modReq = this.addTokenHeader(req, this.token);
      return next.handle(modReq).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && !modReq.url.includes('auth/login') && error.status === 401) {
          return this.handle401Error(modReq, next);
        }

        return throwError(error);
      }));
    }
    return next.handle(req);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (this.refreshToken)
        return this.authService.refresh({ token: this.token, refreshToken: this.refreshToken }).pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;

            localStorage.setItem('token', res.token);
            localStorage.setItem('refreshToken', res.refreshToken);

            this.token = res.token;
            this.refreshToken = res.refreshToken;

            this.refreshTokenSubject.next(res.token);

            return next.handle(this.addTokenHeader(request, res.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            localStorage.clear();
            return throwError(err);
          }),
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token))),
    );
  }

  private addTokenHeader(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
