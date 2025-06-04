import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import 'zone.js';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/api/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { edit } from '../../shared/components/iconAntd/iconAddOnAntd.component';
import { AccountService } from '../../core/api/account.service';
import { ChangePasswordComponent } from '../../features/setting/change-password/change-password.component';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzIconModule,
    NzSkeletonModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzDropDownModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    TranslateModule,
    ChangePasswordComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnChanges {
  isCollapsed = false;
  isReverseArrow = false;
  idOwner: any;
  nameOwner: any;
  canActive: boolean = false;
  viewDetailUnit = false;
  width = 280;
  language: string = 'vi';
  userName: string;
  role: string;
  _store = inject(Store);
  languageList = [
    {
      label: 'Tiếng Việt',
      value: 'vi',
    },
    {
      label: 'Tiếng anh',
      value: 'en',
    },
  ];

  changeLanguage(e: any) {
    this.language = e;
    this.translate.use(this.language);
    this.cdr.detectChanges();
  }
  tabActive: number = 0;
  lengthTab: number = 5;
  deviceType: string;
  public idTenant: string = '';
  public idParentUnit: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private iconService: NzIconService,
    private authService: AuthService,
    private OauthService: OAuthService,
    private nzContextMenuService: NzContextMenuService,
    private accountService: AccountService,
    private router: Router,
    private message: NzMessageService,
    private authService2: SocialAuthService,
  ) {
    if (navigator.language.includes('vi')) {
      this.translate.use('vi');
      this.language = 'vi';
    } else if (navigator.language.includes('en')) {
      this.translate.use('en');
      this.language = 'en';
    }
    let keysPressed: any = {};

    document.addEventListener('keyup', (event: any) => {
      delete keysPressed[event.keyCode];
    });

    this.iconService.addIconLiteral('edit:antd', edit);
  }
  count: number;
  userInfor: any = JSON.parse(
    localStorage.getItem('id_token_claims_obj') || '{}',
  );
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnInit(): void {
    // Xem quyền người dùng để hiển thị menu
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    this.nameOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.name;
    this.role = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.role;
    if(this.role[0] === 'Administrator'){
      this.canActive = true;
    } else if(this.role[0] === 'User') {
      this.canActive = false;
    }

    console.log(this.OauthService.hasValidAccessToken());
    
    setInterval(() => {
      this.OauthService.refreshToken()
    }, 1800000000)

    if (this.getDeviceType() === 'mobile') {
      this.isCollapsed = true;
      this.cdr.detectChanges();
    }
    this._store.select('renderDataMenu').subscribe((data) => {
      this.cdr.detectChanges();
    });
    const idInterval = setInterval(() => {
      if (localStorage.getItem('id_token_claims_obj')) {
        this.userName = JSON.parse(
          localStorage.getItem('id_token_claims_obj') || '{}',
        )?.name;
        clearInterval(idInterval);
      }
    }, 300);
    this.checkPasswordStatus();
    MainComponent.getData();
    if (this.OauthService.hasValidIdToken()) {
      this.OauthService.refreshToken().then(() => {
        
      });
    } else {
      
    }
  }
  changeTab(index: number) {
    this.tabActive = index;
    this.cdr.detectChanges();
  }


  checkPasswordStatus(): void {
    this.accountService.checkPasswordStatus().subscribe({
      next: (res) => {
        if (res && (res.status === 200 || res.status === 201)) {
          return;
        }
      },
      error: (err) => {
        this.isVisiblePopUpChangePassword = true;
        this.message.error('Bạn chưa đổi mật khẩu mặc định, vui lòng đổi mật khẩu');
      },
    });
  }
  isVisiblePopUpChangePassword: boolean = false;
  handelVisiblePopUpChangePassword(e: boolean) {
    this.isVisiblePopUpChangePassword = e;
  }

  getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  };

  visibleListObject: boolean = false;
  handleVisibleListObject(e: boolean) {
    this.visibleListObject = e;
  }

  public static data: any = [];
  public static getData: any = () => {
    // console.log('á');
    MainComponent.data.push('a');
  };
  get staticData() {
    return MainComponent.data;
  }
  visiblePopUpChangeGroup: boolean = false;
  handleVisiblePopUpGroup(e: boolean) {
    this.visiblePopUpChangeGroup = e;
  }

  isVisiblePopUpChangeOrgnization: boolean = false;
  handelVisiblePopUpChangeOrgnization(e: boolean) {
    this.isVisiblePopUpChangeOrgnization = e;
  }
  handelOpenPopUpChangeOrgnization() {
    this.isVisiblePopUpChangeOrgnization = true;
  }

  tenants: any = [];
  public originalTenantsOrder: any[] = [];
  public hiddenTenantIds: Set<number> = new Set();
  unitOfTenant: any = [];
  isVisiblePopUpCreateOrgnization: boolean = false;
  handelVisiblePopUpCreateOrgnization(e: boolean) {
    this.isVisiblePopUpCreateOrgnization = e;
  }
  handelOpenPopUpCreateOrgnization(idTenant?:any, event?: Event) { 
    event?.preventDefault();  
    event?.stopPropagation();
    this.idTenant = idTenant;
    this.isVisiblePopUpCreateOrgnization = true;
  }

  handleTenantCreated(a: any): void {
    const tenantIndex = this.tenants.findIndex((tenant: any) => tenant.id === a.id);
    if (tenantIndex !== -1) {
      this.tenants[tenantIndex] = a;
    } else {
      this.tenants.push(a);
    }
  }

  closeMenuIndividual(): void {
    this.nzContextMenuService.close();
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  handleLogout() {
    this.authService.logout();
    this.authService2.signOut();
  }

  contextMenuOrgnization(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
  ): void {
    const element = $event.target as HTMLElement;
    console.log($event);

    $event.stopPropagation();
    if (element.innerHTML === 'Organization' || element.innerHTML === 'Tổ chức')
      this.nzContextMenuService.create($event, menu);
  }

  stopPrevenDefault($event: any) {
    $event.preventDefault();
  }

  openMap: { [key: number]: boolean } = {};
  openSubMap: { [key: number]: boolean } = {};

  openHandler(index: number, state: boolean): void {
    for (const i in this.openSubMap) {
      if (Number(i) !== index) {
        this.openSubMap[i] = false;
      }
    }
    this.openSubMap[index] = state;
    // Đóng tất cả các unit cha và unit con
    for (const i in this.openSubMap2) {
      this.openSubMap2[i] = false;
    }
    for (const i in this.openSubMap3) {
      this.openSubMap3[i] = false;
    }
  }

  openMap2: { [key: number]: boolean } = {};
  openSubMap2: { [key: number]: boolean } = {};

  openHandler2(index: number, isSubMenu: boolean = false): void {
    if (isSubMenu) {
      for (const key in this.openSubMap2) {
        if (key !== index.toString()) {
          this.openSubMap2[key] = false;
        }
      }
    } 
  }

  openMap3: { [key: number]: boolean } = {};
  openSubMap3: { [key: number]: boolean } = {};

  openHandler3(index: number, isSubMenu: boolean = false): void {
    if (isSubMenu) {
      for (const key in this.openSubMap3) {
        if (key !== index.toString()) {
          this.openSubMap3[key] = false;
        }
      }
    } 
  }

  handlePinOrganization(tenantId: number | null): void {
    if (tenantId === null) {
      this.tenants = [...this.originalTenantsOrder];
      localStorage.removeItem('pinnedTenantId');
      return;
    }
    localStorage.setItem('pinnedTenantId', tenantId.toString());
    const pinnedTenant = this.tenants.find((tenant: any) => tenant.id === tenantId);
    if (pinnedTenant) {
      this.tenants = this.tenants.filter((tenant: any) => tenant.id !== tenantId);
      this.tenants.unshift(pinnedTenant);
    }
  }

  handleToggleVisibilityTenant(tenantId: number): void {
    if (this.hiddenTenantIds.has(tenantId)) {
        this.hiddenTenantIds.delete(tenantId); 
    } else {
        this.hiddenTenantIds.add(tenantId); 
    }
  }

}
