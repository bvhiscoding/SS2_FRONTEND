import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { settingsIcon } from '../../shared/components/iconAntd/iconAddOnAntd.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timeZoneList } from '../../core/enums/timeZone.enum';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountService } from '../../core/api/account.service';
import { CheckPasswordComponent } from './check-password/check-password.component';
import { CheckInsertOtpComponent } from './check-insert-otp/check-insert-otp.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { InsertOtpNewEmailComponent } from './insert-otp-new-email/insert-otp-new-email.component';


@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    NzIconModule,
    CommonModule,
    TranslateModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    ChangePasswordComponent,
    CheckPasswordComponent,
    CheckEmailComponent,
    CheckInsertOtpComponent,
    ChangeEmailComponent,
    InsertOtpNewEmailComponent
],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  public language: string = 'vi';
  public infoAccount: any = {};
  constructor(
    private iconService: NzIconService,
    private translate: TranslateService, 
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService
  ) {
    this.iconService.addIconLiteral('settingsIcon:antd', settingsIcon);
    this.lang = localStorage.getItem('lang') || this.translate.getDefaultLang();

    const time = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/);
    if (time) {
      this.timeZone = time[0].split(' ')[0];
    }
  }
  ngOnInit(): void {
    this.viewInfo();
  }

  timeZoneList = timeZoneList;
  lang: string = '';
  timeZone: string = '';

  changeLanguage(e: any) {
    this.language = e;
    this.translate.use(this.language);
    this.translate.setDefaultLang(e);
    localStorage.setItem('lang', e);
    this.cdr.detectChanges();
  }

  changeTimeZone(e: any) {
    console.log(e);
  }

  viewInfo(): void {
    this.accountService.getViewInfo().subscribe({
      next: (res) => {
        this.infoAccount = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  isVisiblePopUpChangePassword: boolean = false;
  handelVisiblePopUpChangePassword(e: boolean) {
    this.isVisiblePopUpChangePassword = e;
  }
  handelOpenPopUpChangePassword() {
    this.isVisiblePopUpChangePassword = true;
  }

  // Change email
  isVisibleCheckPassword = false;
  handleShowPopUpForgotPassWord(e: any) {
    this.isVisibleCheckPassword = e.thisPopUp;
    this.isVisibleCheckEmail = e.nextPopUp;
    this.cdr.detectChanges();
  }
  handleOpenPopUpForgotPassWord() {
    this.isVisibleCheckPassword = true;
  }

  isVisibleCheckEmail = false;
  handleShowCheckEmail(e: any) {
    this.isVisibleCheckEmail = e.thisPopUp;
    this.isVisibleInsertOTP = e.nextPopUp;
    this.cdr.detectChanges();
  }

  isVisibleInsertOTP = false;
  handleShowInsertOTPPopUp(e: any) {
    this.isVisibleInsertOTP = e.thisPopUp;
    this.isVisibleChangeEmail = e.nextPopUp;
    this.cdr.detectChanges();
  }

  isVisibleChangeEmail = false;
  handleShowChangeEmail(e: any) {
    this.isVisibleChangeEmail = e.thisPopUp;
    // this.isVisiblePopUpNewOTP = e.nextPopUp;
    this.viewInfo();
    this.cdr.detectChanges();
  }

  // Bỏ luồng check OTP emai mới
  isVisiblePopUpNewOTP = false;
  handleShowNewOTPPopUp(e: any) {
    this.isVisiblePopUpNewOTP = e.thisPopUp;
    this.cdr.detectChanges();
  }
}
