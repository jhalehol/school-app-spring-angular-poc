import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Credentials } from '../entities/credentials';
import { AppPaths } from '../common/app-paths';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'username';
const UNAUTHORIZED_ERRORS = [401];
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  public cleanTokenStored() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USERNAME_KEY);
    this.authenticated.next(false);
  }

  public storeToken(credentials: Credentials) {
    this.cleanTokenStored();
    window.sessionStorage.setItem(TOKEN_KEY, credentials.token);
    window.sessionStorage.setItem(USERNAME_KEY, credentials.userName);
    this.authenticated.next(true);
  }

  public getCurrentCredentials(): Credentials {
    const credentials = new Credentials();
    credentials.token = window.sessionStorage.getItem(TOKEN_KEY);
    credentials.userName = window.sessionStorage.getItem(USERNAME_KEY);
    return credentials;
  }

  public authenticateUser(username: string, password: string): Observable<Credentials> {
    return this.httpClient.post<Credentials>(AppPaths.API.AUTH_TOKEN_URL, {
      username,
      password
    }, httpOptions);
  }

  public handleUnauthorized(error): boolean {
    if (error && error.status) {
      const isAuthError = UNAUTHORIZED_ERRORS.some(code => code === error.status);
      if (isAuthError) {
        this.cleanTokenStored();
        this.router.navigate([AppPaths.UI.LOGIN_PAGE]);
        return true;
      }
    }

    return false;
  }

  public isAuthenticatedNonObservable(): boolean {
    const credentials: Credentials = this.getCurrentCredentials();
    return credentials.credentialsAreValid();
  }

  public isAuthenticated(): Observable<boolean> {
    const isLogged: boolean = this.isAuthenticatedNonObservable();
    this.authenticated.next(isLogged);
    return this.authenticated.asObservable();
  }
}
