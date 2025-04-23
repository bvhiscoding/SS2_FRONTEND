import {
  ChangeDetectorRef,
  Component,
  OnInit,
  importProvidersFrom,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NzI18nService, vi_VN } from 'ng-zorro-antd/i18n';
import { TranslateService } from '@ngx-translate/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import {
  arrowsIcon,
  filterIcon,
  keySquareIcon,
  sortIcon,
} from './shared/components/iconAntd/iconAddOnAntd.component';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzMessageModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class AppComponent implements OnInit {
  title = 'Bầu cử điện tử';
  language: string = 'vi';
  constructor(
    private auth: AuthService,
    private i18n: NzI18nService,
    private translate: TranslateService,
    private iconService: NzIconService,
    private cdr: ChangeDetectorRef,
  ) {
    this.iconService.addIconLiteral('filterIcon:antd', filterIcon);
    this.iconService.addIconLiteral('sortIcon:antd', sortIcon);
    this.iconService.addIconLiteral('keySquareIcon:antd', keySquareIcon);
    this.iconService.addIconLiteral('arrowsIcon:antd', arrowsIcon);
    // this.translate.setDefaultLang('vi');
    // this.translate.use(localStorage.getItem('lang') || 'vi');
    // if (navigator.language.includes('vi')) {
    //   this.translate.use('vi');
    //   this.language = 'vi';
    // } else if (navigator.language.includes('en')) {
    //   this.translate.use('en');
    //   this.language = 'en';
    // }
    if (!localStorage.getItem('lang')) {
      if (navigator.language.includes('vi')) {
        this.translate.setDefaultLang('vi');
      } else if (navigator.language.includes('en')) {
        this.translate.setDefaultLang('en');
      }
    } else {
      this.translate.setDefaultLang(localStorage.getItem('lang')!);
    }
  }
  ngOnInit(): void {
    this.i18n.setLocale(vi_VN);
  }
}
