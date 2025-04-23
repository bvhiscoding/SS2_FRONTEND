import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { SnackbarService } from '../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/api/auth.service';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RegisterComponent } from '../register/register.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ForgotPassWordComponent } from '../forgot-pass-word/forgot-pass-word.component';
import { PopUpInsertOTPComponent } from '../forgot-pass-word/pop-up-insert-otp/pop-up-insert-otp.component';
import { PopUpChangePassComponent } from '../forgot-pass-word/pop-up-change-pass/pop-up-change-pass.component';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../core/auth/auth-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SocialLoginModule, FacebookLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialUser } from '@abacritt/angularx-social-login';
import { Observable } from 'rxjs';
import { PopUpCheckEmailComponent } from '../forgot-pass-word/pop-up-check-email/pop-up-check-email.component';
import { PopUpCheckPhoneComponent } from '../forgot-pass-word/pop-up-check-phone/pop-up-check-phone.component';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    MatInput,
    ReactiveFormsModule,
    MatFormFieldModule,
    NzCheckboxModule,
    FormsModule,
    RegisterComponent,
    TranslateModule,
    ForgotPassWordComponent,
    PopUpInsertOTPComponent,
    PopUpChangePassComponent,
    NzButtonModule,
    SocialLoginModule,
    PopUpCheckEmailComponent,
    PopUpCheckPhoneComponent,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
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
        }
      } as SocialAuthServiceConfig,
    }
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup = this.fb.group({
    userName: [null, Validators.required],
    password: [null, Validators.required],
  });
  wrongUserNameOrPassword: string;
  remember: boolean = false;
  isLoading: boolean = false;
  user: any;
  loggedIn: any;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _snackBar: SnackbarService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private OAuthService: OAuthService,
    private authService: SocialAuthService,
    private http: HttpClient
  ) {
    if (navigator.language.includes('vi')) {
      this.translate.use('vi');
      this.language = 'vi';
    } else if (navigator.language.includes('en')) {
      this.translate.use('en');
      this.language = 'en';
    }
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated',
      );
      if (!this.OAuthService.hasValidAccessToken()) {
        router.navigate(['/login']);
      }
    });
  }
  idIntervalLoginTrueAccount: any;
  ngOnInit(): void {
    this.translate
      .get('Toast.wrongUserNameOrpassword')
      .subscribe((value) => (this.wrongUserNameOrPassword = value));
    this.translate.onLangChange.subscribe((e) => {
      this.translate
        .get('Toast.wrongUserNameOrpassword')
        .subscribe((value) => (this.wrongUserNameOrPassword = value));
    });
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.router.navigate(['/']); 
        console.log("hhhhh")
      }
    });
  }

  language: string = 'vi';
  login() {
    this.isLoading = true;
    const body = {
      username: this.formLogin.get('userName')?.value,
      password: this.formLogin.get('password')?.value,
      rememberMe: true,
    };
    if (this.formLogin.invalid) {
      this.formLogin.get('userName')?.markAsTouched();
      this.formLogin.get('password')?.markAsTouched();
      this.isLoading = false;

      return;
    }

    this.OAuthService.setStorage(localStorage);
    this.OAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.OAuthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        console.log('Discovery document loaded');
        this.OAuthService.tryLogin();
      })
      .catch((err) => {
        console.error('Error loading discovery document', err);
      });
    this.OAuthService.initImplicitFlow();
    this.OAuthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
      this.formLogin.get('userName')?.value || 'administrator',
      this.formLogin.get('password')?.value || 'Administrator1',
    )
      .then((res) => {
        this.isLoading = false;
        this.OAuthService.setupAutomaticSilentRefresh();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.isLoading = false;
        if (err?.error?.error_description.includes('The user account has been disabled.')) {
          this._snackBar.error('Tài khoản của bạn đã bị vô hiệu hoá');
        } else {
          this._snackBar.error(this.wrongUserNameOrPassword);
        }
      });

    this.OAuthService.events.subscribe((event) => {
      if (event.type === 'token_expires') {
        console.log('Token is about to expire. Performing silent refresh...');
        this.OAuthService.silentRefresh()
          .then((info) => {
            console.log('Silent refresh successful', info);
          })
          .catch((err) => {
            console.error('Silent refresh error', err);
          });
      }
    });

    this.OAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.OAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  hide: boolean = true;
  showPass(e: any) {
    const inputPass = document.querySelector('#inputPass') as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';

      this.hide = false;
    } else {
      inputPass.type = 'password';
      this.hide = true;
    }
  }
  forgotPassword() {}
  isVisibleRegister = false;
  handleShowRegisterPopUp(e: boolean) {
    this.isVisibleRegister = e;
  }
  handleOpenPopUpRegister() {
    this.isVisibleRegister = true;
  }

  isVisibleForgotPassWord = false;
  handleShowForgotPassWordPopUp(e: any) {
    this.isVisibleForgotPassWord = e.thisPopUp;
    if(e.value === '0'){
      this.isVisibleCheckPhone = e.nextPopUp;
    }
    if(e.value === '1'){
      this.isVisibleCheckEmail = e.nextPopUp;
    }
    this.cdr.detectChanges();
  }
  handleOpenPopUpForgotPassWord() {
    this.isVisibleForgotPassWord = true;
  }

  isVisibleInsertOTP = false;
  handleShowInsertOTPPopUp(e: any) {
    this.isVisibleInsertOTP = e.thisPopUp;
    this.isVisibleChangePass = e.nextPopUp;
    this.cdr.detectChanges();
  }

  isVisibleCheckEmail = false;
  handleShowCheckEmail(e: any) {
    this.isVisibleCheckEmail = e.thisPopUp;
    this.isVisibleInsertOTP = e.nextPopUp;
    this.cdr.detectChanges();
  }

  isVisibleCheckPhone = false;
  handleShowCheckPhone(e: any) {
    this.isVisibleCheckPhone = e.thisPopUp;
    this.isVisibleInsertOTP = e.nextPopUp;
    this.cdr.detectChanges();
  }

  isVisibleChangePass = false;
  handleShowChangePassPopUp(e: boolean) {
    this.isVisibleChangePass = e;
  }

  changeLanguage(e: any) {
    this.language = e;
    this.translate.use(this.language);
    this.cdr.detectChanges();
  }
  loginWithTrueAccount() {
    this.OAuthService.setupAutomaticSilentRefresh();
    this.OAuthService.initImplicitFlow();
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      console.log("Facebook login response:", user);
      if (user) {
        this.auth.handleOAuthLogin(user.authToken, user.email).subscribe(
          (response) => {
            this.OAuthService.setupAutomaticSilentRefresh();
            this.router.navigate(['/']);
          },
          (error) => {
            console.error("Failed to authenticate with server:", error);
            this._snackBar.error(this.wrongUserNameOrPassword);
          }
        );
      } else {
        console.error("User login failed");
        this._snackBar.error(this.wrongUserNameOrPassword);
      }
    }).catch((err) => {
      console.error("Failed to log in with Facebook", err);
      this._snackBar.error(this.wrongUserNameOrPassword);
    });
  }
  
  

  signOut(): void {
    this.authService.signOut();
  }
}
