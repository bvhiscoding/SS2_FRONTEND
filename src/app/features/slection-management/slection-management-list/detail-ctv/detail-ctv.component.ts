import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ManagermentService } from '../../../../core/api/managerment.service';

@Component({
  selector: 'app-detail-ctv',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './detail-ctv.component.html',
  styleUrl: './detail-ctv.component.scss'
})
export class DetailCtvComponent implements OnInit, OnChanges{
  @Input() isVisibleDetail: boolean = true;
  @Input() idCtv: any;
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpDetail = new EventEmitter<boolean>();
  public edit: boolean = false;
  public viewInfo: any = {};

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private managermentService: ManagermentService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCtv']) {
      if(this.idCtv) {
        this.handleView();
      }
    }
  }
  ngOnInit(): void {
    if(this.idCtv) {
      this.handleView();
    }
  }

  handleView(): void {
    this.managermentService.getUserById(this.idCtv).subscribe({
      next: (res) => {
        this.viewInfo = res;
        this.message.success('Lấy thông tin thành công');
      },
      error: (err) => {
        this.message.error('Lỗi lấy thông tin');
      }
    })
  }

  handleCancel(): void {
    this.visiblePopUpDetail.emit(false);
  }
}
