import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthModel, LoginTokenModel, RefreshToken} from './auth.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {NbAuthService, NbPasswordAuthStrategy, NbTokenService} from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends NbAuthService {
  constructor(private http: HttpClient, tokenService: NbTokenService, strategies: NbPasswordAuthStrategy) {
    super(tokenService, strategies);
  }

  login(auth: AuthModel): Observable<LoginTokenModel> {
    return this.http.post<LoginTokenModel>(`${environment.environment}Identity/login`, auth);
  }

  registerUser(auth: AuthModel): Observable<LoginTokenModel> {
    return this.http.post<LoginTokenModel>(`${environment.environment}Identity/register`, auth);
  }

  refresh(auth: RefreshToken): Observable<LoginTokenModel> {
    return this.http.post<LoginTokenModel>(`${environment.environment}Identity/refresh`, auth);
  }
}
