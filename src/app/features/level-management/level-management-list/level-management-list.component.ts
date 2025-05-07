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
import { LevelManagementAddComponent } from '../level-management-add/level-management-add.component';
import { PopupDeleteComponent } from '../popup-delete/popup-delete.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PositionService } from '../../../core/api/position.service';

@Component({
  selector: 'app-level-management-list',
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
    LevelManagementAddComponent,
    PopupDeleteComponent
  ],
  templateUrl: './level-management-list.component.html',
  styleUrl: './level-management-list.component.scss'
})
export class LevelManagementListComponent implements OnInit{
  public isLoading: boolean = false;
  public totalCount: number = 10;
  public idLevelManagement: any = '';
  public nameLevel: any = '';
  public listPosition: any = [];
  public searchQuery: string = '';
  public role: string;
  public mode: 'create' | 'edit' = 'create';
  public params = {
    page: 1,
    pageSize:10
  }

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
    private message: NzMessageService,
    private positionService: PositionService,
  ){}
  
  ngOnInit(): void {
    this.viewListPosition();
  }

  viewListPosition() {
    this.isLoading = true;
    this.positionService.getAllPosition(this.params.page, this.params.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.listPosition = res.data;
        this.totalCount = res.totalItems;
        this.cdr.detectChanges();
        this.message.success('Lấy dữ liệu thành công');
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }

  isVisiblePopUpAddLevelManagement: boolean = false;
  handelVisiblePopUpAddLevelManagement(e: boolean) {
    this.isVisiblePopUpAddLevelManagement = e;
    this.viewListPosition();
    this.cdr.detectChanges();
  }
  handelOpenPopUpAddLevelManagement() {
    this.mode = 'create';
    this.isVisiblePopUpAddLevelManagement = true;
    this.cdr.detectChanges();
  }

  handelOpenPopUpEditManagement(id: string) {
    this.idLevelManagement = id;
    this.mode = 'edit';
    this.isVisiblePopUpAddLevelManagement = true;
    this.cdr.detectChanges();
  }

  openDeletePopup(id?: string, name?: any) {
    this.isVisible = true;
    this.nameLevel = name;
    this.idLevelManagement = id;
  }
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      this.viewListPosition();
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
    this.viewListPosition();
  }
  changePageSize(e: number) {
    this.params.pageSize = e;
    this.viewListPosition();
  }
}
