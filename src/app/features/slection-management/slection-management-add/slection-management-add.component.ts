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
import { ManagermentService } from '../../../core/api/managerment.service';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { VoteService } from '../../../core/api/vote.service';
import { PositionService } from '../../../core/api/position.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-slection-management-add',
  standalone: true,
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
    MatCheckboxModule
  ],
  templateUrl: './slection-management-add.component.html',
  styleUrl: './slection-management-add.component.scss'
})
export class SlectionManagementAddComponent implements OnInit, OnChanges{
  @Input() isVisiblePopUpAddSlectionManagement: boolean = true;
  @Input() idSlectionManagement: any;
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpAddSlectionManagement = new EventEmitter<boolean>();
  public edit: boolean = false;
  public listCandidate: any[] = [];
  public listVoter: any[] = [];
  public listLevel: any[] = [];
  public candidateNames: string[] = [];
  public voterNames: string[] = [];
  public statusBolean: boolean = false;
  public statusValue: any;

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
    private positionService: PositionService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idSlectionManagement']) {
      this.viewListUser();
      this.setupFormListeners();
      this.viewPosition();
      if(this.idSlectionManagement && this.mode === 'edit') {
        this.edit = true;
        this.viewDetailVote();
      } else {
        this.edit = false;
        this.form.reset(); 
      }
    }
  }
  ngOnInit(): void {
    this.viewListUser();
    this.setupFormListeners();
    this.viewPosition();
    this.form.controls['isAdmin'].disable();
    if(this.idSlectionManagement && this.mode === 'edit') {
      this.edit = true;
      this.viewDetailVote();
    } else {
      this.edit = false;
      this.form.reset(); 
    }
  }

  viewListUser() {
    this.managermentService.getAllCandidateVoter(1, 999).subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.listCandidate = res;
          this.listVoter = res;
          this.filteredCandidates = [...this.listCandidate];
          this.filteredVoters = [...this.listVoter];
          this.updateFilteredLists();
          this.cdr.detectChanges();
        } else {
          this.listCandidate = [];
          this.listVoter = [];
          this.filteredCandidates = [];
          this.filteredVoters = [];
          this.message.error('Không thể lấy danh sách người dùng');
        }
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.listCandidate = [];
        this.listVoter = [];
        this.filteredCandidates = [];
        this.filteredVoters = [];
        this.message.error('Lỗi khi tải danh sách người dùng');
      }
    });
  }

  filteredCandidates: any[] = [];
  filteredVoters: any[] = [];

  setupFormListeners() {
    this.form.get('candidates')?.valueChanges.subscribe((selectedIds: number[]) => {
      if (selectedIds) {
        this.updateFilteredLists();
        this.updateCandidateNames(selectedIds);
      }
    });
    this.form.get('voters')?.valueChanges.subscribe((selectedIds: number[]) => {
      if (selectedIds) {
        this.updateFilteredLists();
        this.updateVotersNames(selectedIds);
      }
    });
  }

  updateFilteredLists() {
    const selectedCandidates = this.form.get('candidates')?.value || [];
    const selectedVoters = this.form.get('voters')?.value || [];

    this.filteredCandidates = this.listCandidate.filter((candidate: any) => 
      candidate && candidate.id && !selectedVoters.includes(candidate.id)
    );
    this.filteredVoters = this.listVoter.filter((voter: any) => 
      voter && voter.id && !selectedCandidates.includes(voter.id)
    );

    this.cdr.detectChanges();
  }

  updateCandidateNames(selectedIds: number[]) {
    if (selectedIds && Array.isArray(selectedIds)) {
      this.candidateNames = this.listCandidate
        .filter((candidate: any) => candidate && candidate.id && selectedIds.includes(candidate.id))
        .map((candidate: any) => candidate.userName || '');
    }
  }

  updateVotersNames(selectedIds: number[]) {
    if (selectedIds && Array.isArray(selectedIds)) {
      this.voterNames = this.listVoter
        .filter((voter: any) => voter && voter.id && selectedIds.includes(voter.id))
        .map((voter: any) => voter.userName || '');
    }
  }

  viewPosition() {
    this.positionService.slectionPosition(1, 999).subscribe(res => {
      this.listLevel = res.data;
    });
  }

  handleOk(): void {
    const body = {
      voteName: this.form.get('name')?.value,
      maxCandidateVote: Number(this.form.get('number')?.value),
      createDate: new Date(),
      status: null,
      extraData: 'String',
      startDate: this.form.get('startDateSlection')?.value,
      expiredDate: this.form.get('endDateSlection')?.value,
      positionId: this.form.get('position')?.value,
      tenure: this.form.get('term')?.value,
      startDateTenure: this.form.get('startDateTerm')?.value,
      endDateTenure: this.form.get('endDateTerm')?.value,
      candidates: this.form.get('candidates')?.value,
      candidateNames:  this.candidateNames,
      voters: this.form.get('voters')?.value,
      voterNames: this.voterNames
    };
    this.voteService.createVote(body).pipe(
      switchMap(() => this.voteService.sendEmail(body))
    ).subscribe({
      next: () => {
        this.message.success('Tạo cuộc bầu cử và gửi email thành công');
        this.visiblePopUpAddSlectionManagement.emit(false);
      },
      error: (err) => {
        this.message.error('Đã xảy ra lỗi!');
      }
    });
  }

  viewDetailVote(): void {
    this.voteService.detailVote(this.idSlectionManagement).subscribe({
      next: (res) => {
        if (res && res.data) {
          if (res.status !== undefined) {
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
            candidates: res.data.candidates || [],
            voters: res.data.voters || [],
          });
          this.updateFilteredLists();
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading vote details:', err);
        this.message.error('Đã xảy ra lỗi khi tải thông tin cuộc bầu cử!');
      },
    });
  }

  setFormState(status: any) {
    this.statusValue = status;
    if (status === '1' || status === '2') {
      this.statusBolean = true;
      if(status === '2') {
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

  handleEdit(): void {
    const body = {
      id: this.idSlectionManagement,
      voteName: this.form.get('name')?.value,
      maxCandidateVote: Number(this.form.get('number')?.value),
      createDate: new Date(),
      status: null,
      extraData: 'String',
      startDate: this.form.get('startDateSlection')?.value,
      expiredDate: this.form.get('endDateSlection')?.value,
      positionId: this.form.get('position')?.value,
      tenure: this.form.get('term')?.value,
      startDateTenure: this.form.get('startDateTerm')?.value,
      endDateTenure: this.form.get('endDateTerm')?.value,
      candidates: this.form.get('candidates')?.value,
      candidateNames:  this.candidateNames,
      voters: this.form.get('voters')?.value,
      voterNames: this.voterNames
    };
    this.voteService.updateVote(body).subscribe({
      next: (res) => {
        this.message.success('Chỉnh sửa cuộc bầu cử thành công');
        this.visiblePopUpAddSlectionManagement.emit(false);
      },
      error: (err) => {
        this.message.error('Đã xảy ra lỗi!');
      },
    });
  }

  handleCancel(): void {
    this.visiblePopUpAddSlectionManagement.emit(false);
  }
}
