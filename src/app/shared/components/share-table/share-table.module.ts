import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareTableComponent } from './share-table.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SharePaginationModule } from '../share-pagination/share-pagination.module';

@NgModule({
  declarations: [ShareTableComponent],
  imports: [CommonModule, SharePaginationModule, NzSpinModule, NzIconModule],
  exports: [ShareTableComponent],
})
export class ShareTableModule {}
