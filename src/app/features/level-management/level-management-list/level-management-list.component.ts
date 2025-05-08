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
        
        // Thêm dòng này
        this.filterAndSortData();
        
        this.cdr.detectChanges();
        this.message.success('Lấy dữ liệu thành công');
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
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

  changePage(page: number): void {
    this.params.page = page;
    this.filterAndSortData(); // Thay vì gọi viewListPosition()
  }
  
  changePageSize(size: number): void {
    this.params.pageSize = size;
    this.params.page = 1; // Reset về trang đầu tiên
    this.filterAndSortData(); // Thay vì gọi viewListPosition()
  }
  // Thêm các thuộc tính mới
  public isFilterActive: boolean = false;
  public showFilterPanel: boolean = false;
  // Thay đổi định nghĩa đối tượng filters
  public filters: {
    status: boolean | null;
    createdDateFrom: string | null;
    createdDateTo: string | null;
    [key: string]: any; // Thêm index signature này
  } = {
    status: null,
    createdDateFrom: null,
    createdDateTo: null
  };
  public activeFilterCount: number = 0;
  public sortField: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public filteredPositions: any[] = []; 
  public filteredCount: number = 0;

  // Thêm các phương thức mới
  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  applyFilters(): void {
    // Đếm số bộ lọc đang áp dụng
    this.activeFilterCount = 0;
    if (this.filters.status !== null) this.activeFilterCount++;
    if (this.filters.createdDateFrom) this.activeFilterCount++;
    if (this.filters.createdDateTo) this.activeFilterCount++;
    
    // Cập nhật isFilterActive dựa trên số lượng bộ lọc
    this.isFilterActive = this.activeFilterCount > 0;
    
    this.filterAndSortData();
    this.params.page = 1; // Reset về trang đầu
  }

  removeFilter(filterName: string): void {
    this.filters[filterName] = null;
    this.applyFilters();
  }
  resetFilters(): void {
    this.filters = {
      status: null,
      createdDateFrom: null,
      createdDateTo: null
    };
    this.activeFilterCount = 0;
    this.isFilterActive = false; // Đặt lại trạng thái này
    this.filterAndSortData();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.filterAndSortData();
  }

  onSearchChange(): void {
    this.params.page = 1;
    this.filterAndSortData();
  }

  filterAndSortData(): void {
    if (!this.listPosition) {
      this.filteredPositions = [];
      this.filteredCount = 0;
      return;
    }
    
    // Lọc dữ liệu
    let filtered = [...this.listPosition];
    
    // Lọc theo trạng thái
    if (this.filters.status !== null) {
      filtered = filtered.filter(item => item.status === this.filters.status);
    }
    
    // Lọc theo ngày tạo (nếu có trong dữ liệu)
    if (this.filters.createdDateFrom && filtered[0]?.createdDate) {
      const fromDate = new Date(this.filters.createdDateFrom);
      filtered = filtered.filter(item => new Date(item.createdDate) >= fromDate);
    }
    
    if (this.filters.createdDateTo && filtered[0]?.createdDate) {
      const toDate = new Date(this.filters.createdDateTo);
      filtered = filtered.filter(item => new Date(item.createdDate) <= toDate);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (this.searchQuery) {
      const searchLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.positionName.toLowerCase().includes(searchLower) || 
        (item.positionDescription && item.positionDescription.toLowerCase().includes(searchLower))
      );
    }
    
    // Sắp xếp dữ liệu
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortField];
        const bValue = b[this.sortField];
        
        if (typeof aValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        } else {
          const comparison = aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }
    
    // Lưu tổng số kết quả
    this.filteredCount = filtered.length;
    
    // Phân trang kết quả
    const startIndex = (this.params.page - 1) * this.params.pageSize;
    this.filteredPositions = filtered.slice(startIndex, startIndex + this.params.pageSize);
  }
}
