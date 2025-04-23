import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services/storage.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { registerModel } from '../model/account.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserLoggedIn!: boolean;
  public apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private OAuthService: OAuthService,
  ) {}

  register(body: any): Observable<any> {
    return this.http.post(this.apiUrl + '/api/user/register', body);
  }

  logout(): void {
    this.storageService.clearStorage();
    this.OAuthService.logOut();
    this.router.navigate(['/login']);
  }

  handleOAuthLogin(token: string, email: string): Observable<any> {
    const body = { token, email };
    return this.http.post(this.apiUrl + '/api/user/register', body);
  }
}
