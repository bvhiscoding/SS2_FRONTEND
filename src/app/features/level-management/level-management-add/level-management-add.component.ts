import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PositionService } from '../../../core/api/position.service';

@Component({
  selector: 'app-level-management-add',
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
    MatDatepickerModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    NzPopconfirmModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './level-management-add.component.html',
  styleUrl: './level-management-add.component.scss'
})
export class LevelManagementAddComponent implements OnInit, OnChanges{
  @Input() isVisiblePopUpAddLevelManagement: boolean = true;
  @Input() idLevelManagement: any;
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpAddLevelManagement = new EventEmitter<boolean>();  public edit: boolean = false;

  listStatus: any[] = [];

  public form: FormGroup = this.fb.group({
    levelName: [null, Validators.required],
    description: [null],
    status: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private positionService: PositionService,
    private modal: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idLevelManagement']) {
      if(this.idLevelManagement && this.mode === 'edit') {
        this.edit = true;
        this.viewPosition();
      } else {
        this.edit = false;
        this.form.reset(); 
      }
    }
  }  ngOnInit(): void {
    this.initStatusList();
    if(this.idLevelManagement && this.mode === 'edit') {
      this.edit = true;
      this.viewPosition();
    } else {
      this.edit = false;
      this.form.reset(); 
    }
  }

  initStatusList(): void {
    this.listStatus = [
      {
        label: this.translate.instant('PositionManagement.active'),
        value: true,
      },
      {
        label: this.translate.instant('PositionManagement.inactive'),
        value: false,
      }
    ];
  }

  handleOk(): void {
    const body = {
      positionName: this.form.get('levelName')?.value,
      positionDescription: this.form.get('description')?.value,
      status: this.form.get('status')?.value,
    };
    if (this.form.invalid) {
      this.form.get('levelName')?.markAsTouched();
      this.form.get('description')?.markAsTouched();
      this.form.get('status')?.markAsTouched()
      return;
    }    this.positionService.createPosition(body).subscribe(res => {
      if(res) {
        this.message.success(this.translate.instant('PositionManagementAdd.addSuccess'));
        this.visiblePopUpAddLevelManagement.emit(false);
      }
    }, (err) => {
      this.message.error(this.translate.instant('PositionManagementAdd.addError'));
    })
  }

  viewPosition(): void {
    this.positionService.viewPosition(this.idLevelManagement).subscribe({
      next: (res) => {
        this.form.patchValue({
          levelName: res.data.positionName,
          description: res.data.positionDescription,
          status: res.data.status,
        });
      },
      error: (err) => {
        this.message.error('Có lỗi xảy ra');
      }
    })
  }

  handleEdit(): void {
    const body = {
      id: this.idLevelManagement,
      positionName: this.form.get('levelName')?.value,
      positionDescription: this.form.get('description')?.value,
      status: this.form.get('status')?.value,
    };
    if (this.form.invalid) {
      this.form.get('levelName')?.markAsTouched();
      this.form.get('description')?.markAsTouched();
      this.form.get('status')?.markAsTouched()
      return;
    }    this.positionService.updatePosition(body).subscribe({
      next: (res) => {
        this.message.success(this.translate.instant('PositionManagementAdd.updateSuccess'));
        this.visiblePopUpAddLevelManagement.emit(false);
      },
      error: (err) => {
        this.message.error(this.translate.instant('PositionManagementAdd.updateError'));
      }
    })
  }

  handleCancel(): void {
    this.visiblePopUpAddLevelManagement.emit(false);
  }
}
