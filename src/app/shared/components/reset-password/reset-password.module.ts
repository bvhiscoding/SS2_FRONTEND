import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyMatInputModule } from '@ngx-formly/material/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ShareConfirmModule } from '@shared/components/share-confirm/share-confirm.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormlyModule,
    ReactiveFormsModule,
    FormlyMatInputModule,
    NzModalModule,
    ShareConfirmModule,
    NzButtonModule,
    NzIconModule,
  ],
  exports: [ResetPasswordComponent],
})
export class ResetPasswordModule {}
