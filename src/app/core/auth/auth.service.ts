/* eslint-disable brace-style */

import { inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';

import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { injectConfigs } from '../config/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private agency = injectConfigs().endPoints.AGENCY_ROLE_NAME;
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private canAccessAgencySubject$ = new BehaviorSubject<boolean>(false);
  public canAccessAgency$ = this.canAccessAgencySubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  private urlToRedirectSubject$ = new BehaviorSubject<string>('');
  public urlToRedirect$ = this.urlToRedirectSubject$.asObservable();

  private _store = inject(Store);

  private _jwt = inject(JwtHelperService);
  public extractUsername(): string {
    return this._jwt.decodeToken(this.oauthService.getAccessToken())
      .preferred_username;
  }

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$,
    this.canAccessAgencySubject$,
  ]).pipe(map((values) => values.every((b) => b)));

  public canActivateAgencyProtectedRoutes$: Observable<boolean> = combineLatest(
    [this.isAuthenticated$, this.isDoneLoading$, this.canAccessAgencySubject$],
  ).pipe(map((values) => values.every((b) => b)));

  constructor(
    private oauthService: OAuthService,
    private router: Router,
  ) {
    // Useful for debugging:
    // this.oauthService.events.subscribe((event) => {
    //   if (event instanceof OAuthErrorEvent) {
    //     console.error('OAuthErrorEvent Object:', event);
    //   } else {
    //     console.warn('OAuthEvent Object:', event);
    //   }
    // });
    // this.router.events
    //   .pipe(
    //     filter((event) => !!event),
    //     take(1),
    //   )
    //   .subscribe((event) => {
    //     if (event instanceof NavigationStart) {
    //       this.urlToRedirectSubject$.next(event.url);
    //     }
    //   });
    // // This is tricky, as it might cause race conditions (where access_token is set in another
    // // tab before everything is said and done there.
    // // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    // window.addEventListener('storage', (event) => {
    //   // The `key` is `null` if the event was caused by `.clear()`
    //   if (event.key !== 'access_token' && event.key !== null) {
    //     return;
    //   }
    //   console.warn(
    //     'Noticed changes to access_token (most likely from another tab), updating isAuthenticated',
    //   );
    //   this.isAuthenticatedSubject$.next(
    //     this.oauthService.hasValidAccessToken(),
    //   );
    //   if (!this.oauthService.hasValidAccessToken()) {
    //     this.navigateToLoginPage();
    //   }
    // });
    // this.oauthService.events.subscribe((_) => {
    //   this.isAuthenticatedSubject$.next(
    //     this.oauthService.hasValidAccessToken(),
    //   );
    //   if (
    //     !!this.oauthService.getIdentityClaims() &&
    //     _.type === 'user_profile_loaded'
    //   ) {
    //     const roles: string | string[] | null | undefined =
    //       this.oauthService.getIdentityClaims()['role'];
    //     // check and get position
    //     var countClaims = 0;
    //     if (this.oauthService.getIdentityClaims()['TenantManager']) {
    //       countClaims = countClaims + 1;
    //       // console.log('countClaims', countClaims);
    //     }
    //     if (countClaims > 1) {
    //       router.navigate(['/force-claim-change']);
    //     }
    //     // check and get position branch
    //     var countClaims1 = 0;
    //     if (this.oauthService.getIdentityClaims()['BranchManager']) {
    //       countClaims1 = countClaims1 + 1;
    //       // console.log('countClaims1', countClaims1);
    //     }
    //     if (countClaims1 > 1) {
    //       router.navigate(['/force-claim-change']);
    //     }
    //   }
    // });
    // this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
    // this.oauthService.events
    //   .pipe(filter((e) => ['token_received'].includes(e.type)))
    //   .subscribe(() => this.oauthService.loadUserProfile());
    // this.oauthService.events
    //   .pipe(
    //     filter((e) => ['session_terminated', 'session_error'].includes(e.type)),
    //   )
    //   .subscribe(() => this.navigateToLoginPage());
    // this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence() {
    if (location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(
        location.hash
          .substr(1)
          .split('&')
          .map((kvp) => kvp.split('=')),
      );
    }

    return this.oauthService
      .loadDiscoveryDocument()
      .then(() => {
        this.oauthService.tryLoginImplicitFlow().then(() => {
          if (!this.oauthService.hasValidAccessToken()) {
            return this.oauthService.tryLoginCodeFlow().then(() => {
              return this.oauthService.loadUserProfile().then(() => {
                this.isDoneLoadingSubject$.next(true);

                return Promise.resolve();
              });
            });
          } else {
            return this.oauthService.loadUserProfile().then(() => {
              this.isDoneLoadingSubject$.next(true);
              return Promise.resolve();
            });
          }
        });
      })
      .then(() => {
        // Check for the strings 'undefined' and 'null' just to be sure. Our current
        // login(...) should never have this, but in case someone ever calls
        // initImplicitFlow(undefined | null) this could happen.
        if (
          this.oauthService.state &&
          this.oauthService.state !== 'undefined' &&
          this.oauthService.state !== 'null'
        ) {
          let stateUrl = this.oauthService.state;
          if (!stateUrl.startsWith('/')) {
            stateUrl = decodeURIComponent(stateUrl);
          }
          console.log(
            `There was state of ${this.oauthService.state}, so we are sending you to: ${stateUrl}`,
          );
          this.router.navigateByUrl(stateUrl);
          return Promise.resolve();
        }
        return Promise.resolve();
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }
}
