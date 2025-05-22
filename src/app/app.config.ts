import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { Interceptor } from './core/interceptor/interceptor.interceptor';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import {
  AuthConfig,
  OAuthModuleConfig,
  OAuthStorage,
  provideOAuthClient,
} from 'angular-oauth2-oidc';
import { authAppInitializerFactory } from './core/auth/auth-app-initializer.factory';
import { AuthService } from './core/auth/auth.service';

import { AppConfigService } from './core/config/config.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { authCodeFlowConfig } from '../environments/auth/auth-config';
import { provideEffects } from '@ngrx/effects';
import { SocialLoginModule, FacebookLoginProvider, SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function storageFactory(): OAuthStorage {
  return localStorage;
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideHttpClient(withInterceptors([Interceptor])),
    provideStore(reducers, { metaReducers }),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    { provide: NZ_I18N, useValue: vi_VN },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    provideOAuthClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: authAppInitializerFactory,
      deps: [AuthService],
      multi: true,
    },
    provideAnimations(),
      {
        provide: "SocialAuthServiceConfig",
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider('1006317877546547')
            }
          ],
          onError: (err) => {
            console.error(err);
          },
        } as SocialAuthServiceConfig,
      },
    {
      provide: AuthConfig,
      useValue: authCodeFlowConfig,
    },
    { provide: OAuthStorage, useFactory: storageFactory },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
  ],
};
