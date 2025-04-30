import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { AccountService } from '../../../../core/api/account.service';

@Component({
  selector: 'app-account-disable',
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
  templateUrl: './account-disable.component.html',
  styleUrl: './account-disable.component.scss'
})
export class AccountDisableComponent {
  @Input() isVisible!: boolean;
  @Input() idManagement?: any;
  @Input() nameManagement?: any;
  @Output() changeVisibleDelete = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private accountService: AccountService
  ) {}

  handleOk(): void {
    this.accountService.disableAccount(this.idManagement).subscribe({
      next: (res) => {
        this.message.success('Disable account successfully!');
        this.changeVisibleDelete.emit({ visible: false, isSuccess: true });
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.error.message.includes('User has voted in an active vote')) {
          this.message.error('Người dùng đang trong cuộc bầu cử, không thể vô hiệu hoá');
        } else {
          this.message.error(`Lỗi: ${err.error.message}`);
        }
      },
    })
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
