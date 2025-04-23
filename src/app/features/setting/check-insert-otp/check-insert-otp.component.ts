import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule, NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgOtpInputConfig, NgOtpInputModule } from  'ng-otp-input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountService } from '../../../core/api/account.service';

@Component({
  selector: 'app-check-insert-otp',
  standalone: true,
  imports: [
    NzModalModule,
    NzIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NzSelectModule,
    TranslateModule,
    NzButtonModule,
    MatInputModule,
    NzRadioModule,
    NgOtpInputModule
  ],
  templateUrl: './check-insert-otp.component.html',
  styleUrl: './check-insert-otp.component.scss'
})
export class CheckInsertOtpComponent {
  isConfirmLoading = false;
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  @Input() isVisiblePopUpInsertOTP: boolean = false;
  @Output() isVisiblePopUpOpen = new EventEmitter<any>();

  otpConfig :NgOtpInputConfig = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    inputStyles:{
      'border-radius': '16px'
    },
    containerStyles:{
      'display':'flex'
    },
    inputClass:'each_input',
    containerClass:'all_inputs'
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private accountService: AccountService,
  ) {
    this.timer(2);
  }

  handleOk(): void {
    const body = {
      otp: this.ngOtpInputRef.currentVal
    }
    if(this.ngOtpInputRef.currentVal === null || this.ngOtpInputRef.currentVal.length !== 6){
      this.message.error("Nhập đầy đủ mã OTP!")
      return;
    } else {
      this.isConfirmLoading = true;
      this.accountService.checkOTP(body).subscribe(res => {
        this.isVisiblePopUpOpen.emit({
          thisPopUp: false,
          nextPopUp: true,
        })
        this.isConfirmLoading = false;
      }, (err) => {
        this.isConfirmLoading = false;
        this.message.error("Mã OTP không hợp lệ!")
      })
    }
  }
  size: NzSelectSizeType = 'default';
  handleCancel(): void {
    this.isVisiblePopUpOpen.emit({
      thisPopUp: false,
      nextPopUp: false,
    });
  }

  display: any;
  isLast10Seconds = false;
  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.isLast10Seconds = seconds <= 10;
      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
}
