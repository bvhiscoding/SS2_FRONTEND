import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ManagermentService } from '../../../core/api/managerment.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ManagementAddComponent } from '../management-add/management-add.component';
import { AccountDisableComponent } from './account-disable/account-disable.component';
import { AccountService } from '../../../core/api/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-management-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    ShareTableModule,
    RouterModule,
    NzIconModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ManagementAddComponent,
    AccountDisableComponent
  ],
  templateUrl: './management-list.component.html',
  styleUrl: './management-list.component.scss'
})
export class ManagementListComponent implements OnInit{
  public isLoading: boolean = false;
  public idManagement: any = '';
  public nameManagement: any = '';
  public totalCount: number = 10;
  public listUserManagements : any = [];
  public mode: 'create' | 'edit' = 'create';
  public role: string;
  public params = {
    page: 1,
    pageSize:10
  }

  listStatus = [
    {
      label: 'Chưa đổi mật khẩu',
      value: 0,
    },
    {
      label: 'Hoạt động',
      value: 1,
    },
    {
      label: 'Khoá',
      value: 2,
    },
  ];

  listRoles = [
    {
      label: 'Quản trị viên',
      value: 0,
    },
    {
      label: 'Người dùng thường',
      value: 1,
    }
  ];

  form: FormGroup = this.fb.group({
    fullName: [''],
    email: [null],
    cellPhone: [null],
    createdDate: [null],
    status: [null],
    roles: [null],
  });


  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private managermentService: ManagermentService,
    private accountService: AccountService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.viewListUser();
  }

  viewListUser() {
    this.isLoading = true;
    this.managermentService.getAllManagement(this.params.page, this.params.pageSize).subscribe(res => {
      this.isLoading = false;
      this.listUserManagements = res.data;
      this.totalCount = res.totalItems;
    })
  }

  isVisiblePopUpAddManagement: boolean = false;
  handelVisiblePopUpAddManagement(e: boolean) {
    this.isVisiblePopUpAddManagement = e;
    this.viewListUser();
  }
  handelOpenPopUpAddManagement() {
    this.mode = 'create';
    this.isVisiblePopUpAddManagement = true;
  }

  handleDetail(id?: any):void {
    this.idManagement = id;
    this.mode = 'edit';
    this.isVisiblePopUpAddManagement = true;
  }

  isVisiblePopUpEditManagement: boolean = false;
  handelVisiblePopUpEditManagement(e: boolean) {
    this.isVisiblePopUpEditManagement = e;
  }
  handelOpenPopUpEditManagement(id: string) {
    console.log("Id: ", id)
    this.isVisiblePopUpEditManagement = true;
  }

  openDisablePopup(id?: string, name?: any, status?: any) {
    this.idManagement = id;
    if(status === 'Active') {
      this.isVisible = true;
      this.nameManagement = name;
    } else if (status === 'Disable') {
      this.accountService.activeAccount(this.idManagement).subscribe({
        next: (res) => {
          this.viewListUser();
          this.cdr.detectChanges();
          this.message.success('Active account successfully!');
        },
      })
    }
  }
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      this.viewListUser();
    }
  }

  handleCancel() {
    this.form.reset({ emitEvent: true });
    this.handleSearch();
  }

  handleSearch() {

  }

  changePage(e: number) {
    this.params.page = e;
    this.viewListUser();
  }
  changePageSize(e: number) {
    this.params.pageSize = e;
    this.viewListUser();
  }
}
