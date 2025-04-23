import { HttpInterceptorFn } from '@angular/common/http';

export const Interceptor: HttpInterceptorFn = (request, next) => {
  // DEVELOPMENT MODE: Always pass requests without token checks
  return next(request);
  
  /* Original code (commented out)
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  const oauth = inject(OAuthService);
  const token = localStorage.getItem('access_token');
  const translateService = inject(TranslateService);
  let toast: string;
  translateService
    .get('Toast.TokenExpired')
    .subscribe((value) => (toast = value));
  translateService.onLangChange.subscribe((e) => {
    translateService
      .get('Toast.TokenExpired')
      .subscribe((value) => (toast = value));
  });
  if (token) {
    const AuthRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'x-tenant': `true-connect`,
      },
    });
    return next(AuthRequest).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // Handle HTTP errors
          if (err.status === 401) {
            // Specific handling for unauthorized errors
            router.navigate(['/login']);

            console.error('Unauthorized request:', err);
            oauth
              .refreshToken()
              .then(() => {
                // location.reload();
                snackbar.error(toast);
              })
              .catch((err) => {
                snackbar.error(toast);
                router.navigate(['/login']);
              });

            // You might trigger a re-authentication flow or redirect the user here
          }
        } else {
          // Handle non-HTTP errors
          console.error('An error occurred:', err);
        }

        // Re-throw the error to propagate it further
        return throwError(() => err);
      }),
    );
  } else {
    return next(request);
  }
  */
};