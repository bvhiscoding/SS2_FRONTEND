import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { PositionService } from '../../../core/api/position.service';

@Component({
  selector: 'app-popup-delete',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './popup-delete.component.html',
  styleUrl: './popup-delete.component.scss'
})
export class PopupDeleteComponent {
  @Input() isVisible!: boolean;
  @Input() idLevelManagement?: any;
  @Input() nameLevel?: any;
  @Output() changeVisibleDelete = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private positionService: PositionService,
  ) {}

  handleOk(): void {
    this.positionService.deletePosition(this.idLevelManagement).subscribe({
      next: (res) => {
        this.message.success('Xoá thành công!');
        this.changeVisibleDelete.emit({ visible: false, isSuccess: true });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Xoá thất bại!');
      },
    });
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
