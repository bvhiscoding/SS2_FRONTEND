import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzModalComponent,
  NzModalModule,
  NzModalRef,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ManagermentService } from '../../../core/api/managerment.service';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VoteService } from '../../../core/api/vote.service';
import { PositionService } from '../../../core/api/position.service';
import { switchMap, Observable, of, timer } from 'rxjs';
import { forkJoin } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-slection-management-add',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Cải thiện hiệu suất
  imports: [
    FormsModule,
    MatInput,
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
    MatCheckboxModule,
  ],
  templateUrl: './slection-management-add.component.html',
  styleUrl: './slection-management-add.component.scss',
})
export class SlectionManagementAddComponent implements OnInit, OnChanges {
  @Input() isVisiblePopUpAddSlectionManagement: boolean = true;
  @Input() idSlectionManagement: any;
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpAddSlectionManagement = new EventEmitter<{
    visible: boolean;
    reload: boolean;
  }>();
  public edit: boolean = false;
  public listCandidate: any = [];
  public listVoter: any = [];
  public listLevel: any = [];
  public candidateNames: any = [];
  public voterNames: any = [];
  public statusBolean: boolean = false;
  public statusValue: any;

  // Loading states để cải thiện UX
  public isLoadingDetail: boolean = false;
  public isLoadingUsers: boolean = false;
  public isLoadingPositions: boolean = false;

  // Cache để tránh gọi API nhiều lần
  private static usersCache: any = null;
  private static positionsCache: any = null;
  private static cacheTimestamp: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 phút

  public form: FormGroup = this.fb.group({
    name: [''],
    position: [null],
    number: [0],
    startDateSlection: [''],
    endDateSlection: [''],
    term: [''],
    startDateTerm: [''],
    endDateTerm: [''],
    candidates: [[]],
    voters: [[]],
  });
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private managermentService: ManagermentService,
    private voteService: VoteService,
    private positionService: PositionService,
  ) {
    // Preload static data ngay khi component được khởi tạo
    this.loadStaticData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSlectionManagement']) {
      // Chỉ setup form listeners một lần nếu chưa được setup
      this.setupFormListeners();

      if (this.idSlectionManagement && this.mode === 'edit') {
        this.edit = true;
        this.loadDataForEdit();
      } else {
        this.edit = false;
        this.form.reset();
        this.loadStaticData();
      }
    }
  }

  ngOnInit(): void {
    this.setupFormListeners();

    if (this.idSlectionManagement && this.mode === 'edit') {
      this.edit = true;
      this.loadDataForEdit();
    } else {
      this.edit = false;
      this.loadStaticData();
    }
  } // Kiểm tra cache còn hợp lệ không
  private isCacheValid(): boolean {
    return (
      SlectionManagementAddComponent.cacheTimestamp > 0 &&
      Date.now() - SlectionManagementAddComponent.cacheTimestamp <
        SlectionManagementAddComponent.CACHE_DURATION
    );
  }

  // Cải thiện: Load data tĩnh với caching
  loadStaticData(): void {
    // Kiểm tra cache trước
    if (
      this.isCacheValid() &&
      SlectionManagementAddComponent.usersCache &&
      SlectionManagementAddComponent.positionsCache
    ) {
      this.listCandidate = SlectionManagementAddComponent.usersCache;
      this.listVoter = SlectionManagementAddComponent.usersCache;
      this.listLevel = SlectionManagementAddComponent.positionsCache;
      this.updateFilteredLists();
      return;
    }

    this.isLoadingUsers = true;
    this.isLoadingPositions = true;

    // Load song song data tĩnh
    forkJoin({
      users: this.managermentService.getAllCandidateVoter(1, 999),
      positions: this.positionService.slectionPosition(1, 999),
    }).subscribe({
      next: (results) => {
        // Cache dữ liệu
        SlectionManagementAddComponent.usersCache = results.users;
        SlectionManagementAddComponent.positionsCache = results.positions.data;
        SlectionManagementAddComponent.cacheTimestamp = Date.now();

        this.listCandidate = results.users;
        this.listVoter = results.users;
        this.listLevel = results.positions.data;
        this.updateFilteredLists();
        this.isLoadingUsers = false;
        this.isLoadingPositions = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.message.error('Có lỗi khi tải dữ liệu!');
        this.isLoadingUsers = false;
        this.isLoadingPositions = false;
        this.cdr.detectChanges();
      },
    });
  } // Cải thiện: Load tất cả data cần thiết cho edit mode với caching
  loadDataForEdit(): void {
    this.isLoadingDetail = true;

    // Kiểm tra cache cho users và positions
    const needUsers =
      !this.isCacheValid() || !SlectionManagementAddComponent.usersCache;
    const needPositions =
      !this.isCacheValid() || !SlectionManagementAddComponent.positionsCache;

    if (needUsers) this.isLoadingUsers = true;
    if (needPositions) this.isLoadingPositions = true;

    // Tạo danh sách observables cần thiết
    const requests: any = {
      voteDetail: this.voteService.detailVote(this.idSlectionManagement),
    };

    if (needUsers) {
      requests.users = this.managermentService.getAllCandidateVoter(1, 999);
    }

    if (needPositions) {
      requests.positions = this.positionService.slectionPosition(1, 999);
    }

    // Load song song tất cả data cần thiết
    forkJoin(requests).subscribe({
      next: (results: any) => {
        // Xử lý vote detail
        if (results.voteDetail && results.voteDetail.status !== undefined) {
          this.setFormState(results.voteDetail.data.status);
        }
        this.form.patchValue({
          name: results.voteDetail.data.voteName,
          position: results.voteDetail.data.positionId,
          number: results.voteDetail.data.maxCandidateVote,
          startDateSlection: results.voteDetail.data.startDate,
          endDateSlection: results.voteDetail.data.expiredDate,
          term: results.voteDetail.data.tenure,
          startDateTerm: results.voteDetail.data.startDateTenure,
          endDateTerm: results.voteDetail.data.endDateTenure,
          candidates: results.voteDetail.data.candidates,
          voters: results.voteDetail.data.voters,
        });

        // Xử lý users data từ cache hoặc API
        if (results.users) {
          SlectionManagementAddComponent.usersCache = results.users;
          this.listCandidate = results.users;
          this.listVoter = results.users;
          this.isLoadingUsers = false;
        } else if (SlectionManagementAddComponent.usersCache) {
          this.listCandidate = SlectionManagementAddComponent.usersCache;
          this.listVoter = SlectionManagementAddComponent.usersCache;
        }

        // Xử lý positions data từ cache hoặc API
        if (results.positions) {
          SlectionManagementAddComponent.positionsCache =
            results.positions.data;
          this.listLevel = results.positions.data;
          this.isLoadingPositions = false;
        } else if (SlectionManagementAddComponent.positionsCache) {
          this.listLevel = SlectionManagementAddComponent.positionsCache;
        }

        // Cập nhật cache timestamp nếu có data mới
        if (results.users || results.positions) {
          SlectionManagementAddComponent.cacheTimestamp = Date.now();
        }

        this.updateFilteredLists();

        // Update loading states
        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.message.error('Có lỗi khi tải dữ liệu cuộc bầu cử!');
        this.isLoadingDetail = false;
        this.isLoadingUsers = false;
        this.isLoadingPositions = false;
        this.cdr.detectChanges();
      },
    });
  }

  viewListUser() {
    this.isLoadingUsers = true;
    this.managermentService.getAllCandidateVoter(1, 999).subscribe({
      next: (res) => {
        this.listCandidate = res;
        this.listVoter = res;
        this.updateFilteredLists();
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.message.error('Có lỗi khi tải danh sách người dùng!');
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
    });
  }
  filteredCandidates: any = [];
  filteredVoters: any = [];
  private formListenersSetup = false; // Flag để tránh setup listeners nhiều lần

  setupFormListeners() {
    if (this.formListenersSetup) return; // Tránh setup nhiều lần

    this.form
      .get('candidates')
      ?.valueChanges.pipe(
        debounceTime(200), // Debounce 200ms để tối ưu performance
        distinctUntilChanged(),
      )
      .subscribe((selectedIds: number[]) => {
        this.updateFilteredLists();
        this.updateCandidateNames(selectedIds);
      });

    this.form
      .get('voters')
      ?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((selectedIds: number[]) => {
        this.updateFilteredLists();
        this.updateVotersNames(selectedIds);
      });

    this.formListenersSetup = true;
  }

  updateFilteredLists() {
    const selectedCandidates = this.form.get('candidates')?.value || [];
    const selectedVoters = this.form.get('voters')?.value || [];

    this.filteredCandidates = this.listCandidate.filter(
      (candidate: any) => !selectedVoters.includes(candidate.id),
    );
    this.filteredVoters = this.listVoter.filter(
      (voter: any) => !selectedCandidates.includes(voter.id),
    );

    this.cdr.markForCheck();
  }

  updateCandidateNames(selectedIds: number[]) {
    this.candidateNames = this.listCandidate
      .filter((candidate: any) => selectedIds.includes(candidate.id))
      .map((candidate: any) => candidate.userName);
  }

  updateVotersNames(selectedIds: number[]) {
    this.voterNames = this.listVoter
      .filter((voter: any) => selectedIds.includes(voter.id))
      .map((voter: any) => voter.userName);
  }
  viewPosition() {
    this.isLoadingPositions = true;
    this.positionService.slectionPosition(1, 999).subscribe({
      next: (res) => {
        this.listLevel = res.data;
        this.isLoadingPositions = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.message.error('Có lỗi khi tải danh sách chức vụ!');
        this.isLoadingPositions = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleOk(): void {
    const currentDate = new Date();
    const startDate = new Date(this.form.get('startDateSlection')?.value);
    const endDate = new Date(this.form.get('endDateSlection')?.value);

    // Tự động set status dựa trên thời gian
    let status: string;
    if (currentDate < startDate) {
      status = '0'; // Chưa bắt đầu
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = '1'; // Đang diễn ra
    } else {
      status = '2'; // Đã kết thúc
    }

    const body = {
      voteName: this.form.get('name')?.value,
      maxCandidateVote: Number(this.form.get('number')?.value),
      createDate: new Date(),
      status: status,
      extraData: 'String',
      startDate: this.form.get('startDateSlection')?.value,
      expiredDate: this.form.get('endDateSlection')?.value,
      positionId: this.form.get('position')?.value,
      tenure: this.form.get('term')?.value,
      startDateTenure: this.form.get('startDateTerm')?.value,
      endDateTenure: this.form.get('endDateTerm')?.value,
      candidates: this.form.get('candidates')?.value,
      candidateNames: this.candidateNames,
      voters: this.form.get('voters')?.value,
      voterNames: this.voterNames,
    };
    this.voteService
      .createVote(body)
      .pipe(switchMap(() => this.voteService.sendEmail(body)))
      .subscribe({
        next: () => {
          this.message.success('Tạo cuộc bầu cử và gửi email thành công');
          this.visiblePopUpAddSlectionManagement.emit({
            visible: false,
            reload: true,
          });
        },
        error: (err) => {
          this.message.error('Đã xảy ra lỗi!');
        },
      });
  }
  viewDetailVote(): void {
    // Method này giờ được thay thế bằng loadDataForEdit() để tối ưu hóa
    // Vẫn giữ lại để tương thích ngược
    this.isLoadingDetail = true;
    this.voteService.detailVote(this.idSlectionManagement).subscribe({
      next: (res) => {
        if (res && res.status !== undefined) {
          this.setFormState(res.data.status);
        }
        this.form.patchValue({
          name: res.data.voteName,
          position: res.data.positionId,
          number: res.data.maxCandidateVote,
          startDateSlection: res.data.startDate,
          endDateSlection: res.data.expiredDate,
          term: res.data.tenure,
          startDateTerm: res.data.startDateTenure,
          endDateTerm: res.data.endDateTenure,
          candidates: res.data.candidates,
          voters: res.data.voters,
        });
        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message.error('Đã xảy ra lỗi!');
        this.isLoadingDetail = false;
        this.cdr.detectChanges();
      },
    });
  }
  setFormState(status: any) {
    this.statusValue = status;
    if (status === '1' || status === '2') {
      this.statusBolean = true;
      if (status === '2') {
        this.message.warning('Cuộc bầu cử đã kết thúc, không thể chỉnh sửa!');
      } else if (status === '1') {
        this.message.warning('Cuộc bầu cử đang diễn ra, không thể chỉnh sửa!');
      }
      this.form.disable();
      this.cdr.detectChanges();
    } else if (status === '0') {
      this.statusBolean = false;
      this.form.enable();
      this.cdr.detectChanges();
    }
  }

  // Phương thức để clear cache khi cần thiết
  static clearCache(): void {
    SlectionManagementAddComponent.usersCache = null;
    SlectionManagementAddComponent.positionsCache = null;
    SlectionManagementAddComponent.cacheTimestamp = 0;
  }

  // Optimized close method
  handleCloseModal(reload: boolean = false): void {
    this.visiblePopUpAddSlectionManagement.emit({
      visible: false,
      reload: reload,
    });

    // Reset form và states
    this.form.reset();
    this.isLoadingDetail = false;
    this.isLoadingUsers = false;
    this.isLoadingPositions = false;
    this.statusBolean = false;
    this.edit = false;

    // Clear filtered lists
    this.filteredCandidates = [];
    this.filteredVoters = [];
    this.candidateNames = [];
    this.voterNames = [];
  }

  handleEdit(): void {
    const currentDate = new Date();
    const startDate = new Date(this.form.get('startDateSlection')?.value);
    const endDate = new Date(this.form.get('endDateSlection')?.value);

    // Tự động set status dựa trên thời gian
    let status: string;
    if (currentDate < startDate) {
      status = '0'; // Chưa bắt đầu
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = '1'; // Đang diễn ra
    } else {
      status = '2'; // Đã kết thúc
    }

    const body = {
      id: this.idSlectionManagement,
      voteName: this.form.get('name')?.value,
      maxCandidateVote: Number(this.form.get('number')?.value),
      createDate: new Date(),
      status: status,
      extraData: 'String',
      startDate: this.form.get('startDateSlection')?.value,
      expiredDate: this.form.get('endDateSlection')?.value,
      positionId: this.form.get('position')?.value,
      tenure: this.form.get('term')?.value,
      startDateTenure: this.form.get('startDateTerm')?.value,
      endDateTenure: this.form.get('endDateTerm')?.value,
      candidates: this.form.get('candidates')?.value,
      candidateNames: this.candidateNames,
      voters: this.form.get('voters')?.value,
      voterNames: this.voterNames,
    };
    this.voteService.updateVote(body).subscribe({
      next: (res) => {
        this.message.success('Chỉnh sửa cuộc bầu cử thành công');
        this.visiblePopUpAddSlectionManagement.emit({
          visible: false,
          reload: true,
        });
      },
      error: (err) => {
        this.message.error('Đã xảy ra lỗi!');
      },
    });
  }
  handleCancel(): void {
    this.visiblePopUpAddSlectionManagement.emit({
      visible: false,
      reload: false,
    });
  }
}
