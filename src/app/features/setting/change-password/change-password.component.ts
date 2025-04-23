import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ManagermentService } from '../../../core/api/managerment.service';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import { passWordValidator } from '../../../shared/validate/check-password.directive';
import { AccountService } from '../../../core/api/account.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    MatLabel,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    TranslateModule,
    NzButtonModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  @Input() isVisiblePopUpChangePassword: boolean = true;
  @Output() visiblePopUpChangePassword = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private message: NzMessageService,
  ) {}
  ngOnInit(): void {
    this.form
    .get('rePass')
    ?.addValidators(rePassValidator(this.form.get('password')?.value));
  }
  public isLoading: boolean = false;
  public errorMessage: string = '';
  public hideOldPass: boolean = true;
  public hidePass: boolean = true;
  public hideRePass: boolean = true;
  public form: FormGroup = this.fb.group({
    oldPassword: [null, Validators.required],
    password: [null, [Validators.required, passWordValidator()]],
    rePass: [null, Validators.required],
  });

  updateValidateRepass(e: any) {
    this.form.get('rePass')?.clearValidators();
    this.form.get('rePass')?.addValidators(rePassValidator(e.target.value));
  }

  handleOk(): void {
    this.isLoading = true;
    if (this.form.invalid) {
      this.form.get('oldPassword')?.markAsTouched();
      this.form.get('password')?.markAsTouched();
      this.form.get('rePass')?.markAsTouched();
      return;
    }
    const body = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.password,
      comfirmedPassword: this.form.value.rePass
    };
    this.accountService.changePassword(body).subscribe(res => {
      this.isLoading = true;
      this.visiblePopUpChangePassword.emit(false);
      this.message.success('Change Password Success!');
    },
      (err) => {
        this.isLoading = true;
        this.errorMessage = err.error;
        this.message.error(err.error);
      }
    )
  }

  handleCancel(): void {
    this.visiblePopUpChangePassword.emit(false);
  }

  showOldPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangeOldPassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hideOldPass = false;
    } else {
      inputPass.type = 'password';
      this.hideOldPass = true;
    }
  }
  showPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hidePass = false;
    } else {
      inputPass.type = 'password';
      this.hidePass = true;
    }
  }
  showRePass(e: any) {
    const inputPass = document.querySelector(
      '#inputRePassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';

      this.hideRePass = false;
    } else {
      inputPass.type = 'password';
      this.hideRePass = true;
    }
  }
}
