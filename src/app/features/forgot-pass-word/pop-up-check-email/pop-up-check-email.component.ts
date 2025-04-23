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

@Component({
  selector: 'app-pop-up-check-email',
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
  templateUrl: './pop-up-check-email.component.html',
  styleUrl: './pop-up-check-email.component.scss'
})
export class PopUpCheckEmailComponent {
  isConfirmLoading = false;
  @Input() isVisiblePopUpCheckEmail: boolean = false;
  @Output() isVisiblePopUpOpen = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private message: NzMessageService,
  ) {}

  public form: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
  });

  handleOK(): void {
    const body = {
      email: this.form.get('email')?.value,
    }
    if (this.form.valid) {
      this.accountService.checkEmail(body).subscribe(res => {
        this.message.success("Xác thực email thành công!")
        this.isVisiblePopUpOpen.emit({
          thisPopUp: false,
          nextPopUp: true,
        });
      }, 
      (err) =>{
        this.message.error("Xác thực email không thành công!")
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
