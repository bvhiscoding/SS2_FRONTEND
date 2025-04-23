import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { rePassValidator } from '../../../shared/validate/check-repass.directive';

@Component({
  selector: 'app-pop-up-change-pass',
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
  templateUrl: './pop-up-change-pass.component.html',
  styleUrl: './pop-up-change-pass.component.scss',
})
export class PopUpChangePassComponent {
  isConfirmLoading = false;
  @Input() isVisiblePopUpChangePass: boolean = false;
  @Output() isVisiblePopUpOpen = new EventEmitter<any>();

  handleOk(): void {
    console.log('Button ok clicked!');
    if (this.form.invalid) {
      this.form.get('password')?.markAsTouched();
      this.form.get('rePass')?.markAsTouched();

      return;
    }
    this.isVisiblePopUpOpen.emit(false);
  }
  size: NzSelectSizeType = 'default';
  handleCancel(): void {
    this.isVisiblePopUpOpen.emit(false);
  }
  public form: FormGroup = this.fb.group({
    password: [null, Validators.required],
    rePass: [null, Validators.required],
  });
  ngOnInit(): void {
    this.form
      .get('rePass')
      ?.addValidators(rePassValidator(this.form.get('password')?.value));
  }
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  updateValidateRepass(e: any) {
    this.form.get('rePass')?.clearValidators();
    this.form.get('rePass')?.addValidators(rePassValidator(e.target.value));
  }

  hidePass: boolean = true;
  hideRePass: boolean = true;
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
