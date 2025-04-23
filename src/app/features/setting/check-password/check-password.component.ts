import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AccountService } from '../../../core/api/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { passWordValidator } from '../../../shared/validate/check-password.directive';

@Component({
  selector: 'app-check-password',
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
  ],
  templateUrl: './check-password.component.html',
  styleUrl: './check-password.component.scss'
})
export class CheckPasswordComponent {
  isConfirmLoading = false;
  public hideOldPass: boolean = true;
  @Input() isVisiblePopUpCheckPassword: boolean = false;
  @Output() isVisiblePopUpOpen = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private message: NzMessageService,
  ) {}

  toggleShowOldPass() {
    this.hideOldPass = !this.hideOldPass;
  }

  public form: FormGroup = this.fb.group({
    password: [null, [Validators.required, passWordValidator()]],
  });



  handleOK(): void {
    const body = {
      password: this.form.get('password')?.value,
    }
    if (this.form.valid) {
      this.isConfirmLoading = true;
      this.accountService.checkPassword(body).subscribe({
        next: (res: any) => {
          this.message.success("Xác thực mật khẩu thành công!")
          this.isVisiblePopUpOpen.emit({
            thisPopUp: false,
            nextPopUp: true,
          });
          this.isConfirmLoading = false;
        },
        error: (err: any) => {
          this.message.error("Xác thực mật khẩu thất bại!")
          this.isConfirmLoading = false;
        }
      })
    } else {
      this.form.markAllAsTouched(); 
    }
  }
  

  handleCancel(): void {
    this.isVisiblePopUpOpen.emit({
      thisPopUp: false,
      nextPopUp: false,
    });
  }
}
