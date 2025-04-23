import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareConfirmComponent } from './share-confirm.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ShareConfirmComponent],
  imports: [CommonModule, NzIconModule, NzButtonModule],
  exports: [ShareConfirmComponent],
})
export class ShareConfirmModule {}
