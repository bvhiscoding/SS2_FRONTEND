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
import { phoneNumberValidator } from '../../shared/validate/check-phone-number.directive';
import { rePassValidator } from '../../shared/validate/check-repass.directive';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-forgot-pass-word',
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
  templateUrl: './forgot-pass-word.component.html',
  styleUrl: './forgot-pass-word.component.scss',
})
export class ForgotPassWordComponent {
  isConfirmLoading = false;
  @Input() isVisiblePopUpForgotPassWord: boolean = false;
  @Output() isVisiblePopUpOpen = new EventEmitter<any>();

  handleOk(): void {
    console.log('Button ok clicked!');
    if (this.form.invalid) {
      this.form.get('reciveOTP')?.markAsTouched();
      return;
    }
    const selectedOption = this.form.get('reciveOTP')?.value;
    console.log("OKE: ", selectedOption)
    this.isVisiblePopUpOpen.emit({
      thisPopUp: false,
      nextPopUp: true,
      value: selectedOption
    });
  }
  size: NzSelectSizeType = 'default';
  handleCancel(): void {
    this.isVisiblePopUpOpen.emit({
      thisPopUp: false,
      nextPopUp: false,
    });
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  public form: FormGroup = this.fb.group({
    reciveOTP: [null, Validators.required],
  });
}
