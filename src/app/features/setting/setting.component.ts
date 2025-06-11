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
import { NotificationSettings, SecuritySettings, SettingTabType, UISettings } from './models/setting.interface';


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
    // Notification settings
  public notificationSettings: NotificationSettings = {
    email: {
      security: true,
      election: true,
      results: true
    },
    inApp: {
      sound: false,
      popup: true
    },
    frequency: 'immediate'
  };  // Security settings
  public securitySettings: SecuritySettings = {
    twoFactorEnabled: false
  };

  // UI/Theme settings
  public uiSettings: UISettings = {
    theme: 'default',
    fontSize: 'medium',
    density: 'comfortable',
    animations: {
      pageTransition: true,
      hover: true
    }
  };

  public currentTheme: string = 'default';
  public activeTab: string = 'language'; // Add active tab tracking

  // Navigation tabs
  public settingTabs = [
    { id: 'language', name: 'Ngôn ngữ & Khu vực', icon: 'fa-globe' },
    { id: 'appearance', name: 'Giao diện', icon: 'fa-palette' },
    { id: 'notifications', name: 'Thông báo', icon: 'fa-bell' },
    { id: 'security', name: 'Bảo mật', icon: 'fa-shield-alt' }
  ];

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
    
    // Load notification settings from localStorage
    this.loadNotificationSettings();
    
    // Load UI settings from localStorage
    this.loadUISettings();
  }
  
  ngOnInit(): void {
    this.viewInfo();
  }

  timeZoneList = timeZoneList;
  lang: string = '';
  timeZone: string = '';

  // Notification methods
  private loadNotificationSettings(): void {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(savedSettings) };
    }
  }

  private saveNotificationSettings(): void {
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    // Show success message
    console.log('Notification settings saved successfully');
  }

  onEmailNotificationChange(type: keyof NotificationSettings['email'], event: any): void {
    this.notificationSettings.email[type] = event.target.checked;
    this.saveNotificationSettings();
  }

  onInAppNotificationChange(type: keyof NotificationSettings['inApp'], event: any): void {
    this.notificationSettings.inApp[type] = event.target.checked;
    this.saveNotificationSettings();
  }

  onFrequencyChange(frequency: 'immediate' | 'daily' | 'weekly'): void {
    this.notificationSettings.frequency = frequency;
    this.saveNotificationSettings();
  }
  // Security methods - Removed incomplete features

  // UI/Theme methods
  private loadUISettings(): void {
    const savedSettings = localStorage.getItem('uiSettings');
    if (savedSettings) {
      this.uiSettings = { ...this.uiSettings, ...JSON.parse(savedSettings) };
      this.currentTheme = this.uiSettings.theme;
      this.applyTheme(this.currentTheme);
    }
  }

  private saveUISettings(): void {
    localStorage.setItem('uiSettings', JSON.stringify(this.uiSettings));
    console.log('UI settings saved successfully');
  }

  changeTheme(theme: string): void {
    this.currentTheme = theme;
    this.uiSettings.theme = theme;
    this.applyTheme(theme);
    this.saveUISettings();
  }

  private applyTheme(theme: string): void {
    const root = document.documentElement;
    
    switch (theme) {
      case 'blue':
        root.style.setProperty('--primary-color', '#2563eb');
        root.style.setProperty('--primary-dark', '#1d4ed8');
        break;
      case 'green':
        root.style.setProperty('--primary-color', '#16a34a');
        root.style.setProperty('--primary-dark', '#15803d');
        break;
      default:
        root.style.setProperty('--primary-color', '#0EAF8F');
        root.style.setProperty('--primary-dark', '#0a9579');
        break;
    }
  }
  onFontSizeChange(fontSize: string): void {
    this.uiSettings.fontSize = fontSize as 'small' | 'medium' | 'large';
    this.applyFontSize(fontSize);
    this.saveUISettings();
  }

  private applyFontSize(fontSize: string): void {
    const root = document.documentElement;
    
    switch (fontSize) {
      case 'small':
        root.style.setProperty('--base-font-size', '14px');
        break;
      case 'large':
        root.style.setProperty('--base-font-size', '18px');
        break;
      default:
        root.style.setProperty('--base-font-size', '16px');
        break;
    }
  }

  onAnimationChange(type: 'pageTransition' | 'hover', event: any): void {
    this.uiSettings.animations[type] = event.target.checked;
    this.applyAnimationSettings();
    this.saveUISettings();
  }

  private applyAnimationSettings(): void {
    const root = document.documentElement;
    
    if (!this.uiSettings.animations.pageTransition) {
      root.style.setProperty('--page-transition', 'none');
    } else {
      root.style.setProperty('--page-transition', 'all 0.3s ease');
    }
    
    if (!this.uiSettings.animations.hover) {
      root.style.setProperty('--hover-transition', 'none');
    } else {
      root.style.setProperty('--hover-transition', 'all 0.2s ease');
    }
  }
  onDensityChange(density: string): void {
    this.uiSettings.density = density as 'compact' | 'comfortable' | 'spacious';
    this.applyDensity(density);
    this.saveUISettings();
  }

  private applyDensity(density: string): void {
    const root = document.documentElement;
    
    switch (density) {
      case 'compact':
        root.style.setProperty('--spacing-unit', '0.5rem');
        root.style.setProperty('--padding-unit', '0.75rem');
        break;
      case 'spacious':
        root.style.setProperty('--spacing-unit', '2rem');
        root.style.setProperty('--padding-unit', '2rem');
        break;
      default:
        root.style.setProperty('--spacing-unit', '1rem');
        root.style.setProperty('--padding-unit', '1.5rem');
        break;
    }
  }

  // Navigation methods
  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  isTabActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }

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
