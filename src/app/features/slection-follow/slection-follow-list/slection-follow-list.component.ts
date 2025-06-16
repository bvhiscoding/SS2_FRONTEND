import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ManagermentService } from '../../../core/api/managerment.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DetailCtvComponent } from '../../slection-management/slection-management-list/detail-ctv/detail-ctv.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-slection-follow-list',
  standalone: true,  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    ShareTableModule,
    RouterModule,
    NzIconModule,
    NzSpinModule,
    TranslateModule,
    UserAvatarComponent,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    DetailCtvComponent
  ],
  templateUrl: './slection-follow-list.component.html',
  styleUrl: './slection-follow-list.component.scss'
})
export class SlectionFollowListComponent {
  public isLoading: boolean = false;
  public isVisibleDetail: boolean = false;
  public isVisibleEvoting: boolean = false;
  public idCtv: any = '';
  public idEvoting: any = '';
  public nameEvoting: any = '';
  public numberVote: any;
  public idSlectionManagement: any = '';
  public listUserManagements: any = [];  public listVote: any = [];  public filteredListVote: any[] = []; // Danh sách đã được lọc
  public originalListVote: any[] = []; // Danh sách gốc để backup
  public listStatus: any = [];
  public searchQuery: string = '';
  public role: string;
  public isCandidatesLoading: boolean = true;
  public isVotersLoading: boolean = true;
  get isLoadingOK(): boolean {
    return this.isCandidatesLoading || this.isVotersLoading;
  }

  form: FormGroup = this.fb.group({
    name: [''],
    status: [null],
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private voteService: VoteService,
    private message: NzMessageService,
    private translate: TranslateService,
  ){}
  
  ngOnInit(): void {
    this.initStatusList();
    this.viewListVote();
  }

  initStatusList() {
    this.listStatus = [
      {
        label: this.translate.instant('ElectionFollow.notStarted'),
        value: '0'
      },
      {
        label: this.translate.instant('ElectionFollow.ongoing'),
        value: '1'
      },
      {
        label: this.translate.instant('ElectionFollow.completed'),
        value: '2'
      },
    ];
  }
  viewListVote() {
    this.isLoading = true;
    this.isCandidatesLoading = true;
    this.isVotersLoading = true;
    
    this.voteService.viewListVoteForCandidates().subscribe({
      next: (res) => {
        this.isLoading = false;
        if(res.data.length === 0) {
          this.listVote = [];
          this.originalListVote = [];
          this.filteredListVote = [];
          // Set loading states to false when there are no elections
          this.isCandidatesLoading = false;
          this.isVotersLoading = false;
        } else {          this.listVote = res.data.map((vote: any) => {
            return {
              ...vote,
              candidates: [], // Khởi tạo danh sách ứng viên
              voters: []      // Khởi tạo danh sách cử tri
            };
          });
          
          // Backup dữ liệu gốc để tìm kiếm
          this.originalListVote = [...this.listVote];
          this.filteredListVote = [...this.listVote];
          
          // Tải danh sách ứng viên và cử tri cho mỗi cuộc bầu cử
          let candidatesLoaded = 0;
          let votersLoaded = 0;
          const totalElections = this.listVote.length;
          
          this.listVote.forEach((vote: any) => {
            this.voteService.listViewCandidate(vote.id).subscribe({
              next: (candidateRes) => {
                vote.candidates = candidateRes.data;
                candidatesLoaded++;
                if (candidatesLoaded === totalElections) {
                  this.isCandidatesLoading = false;
                }
                this.cdr.detectChanges();
              },
              error: () => {
                candidatesLoaded++;
                if (candidatesLoaded === totalElections) {
                  this.isCandidatesLoading = false;
                }
                this.cdr.detectChanges();
              }
            });
            
            this.voteService.listViewVoter(vote.id).subscribe({
              next: (voterRes) => {
                vote.voters = voterRes.data;
                votersLoaded++;
                if (votersLoaded === totalElections) {
                  this.isVotersLoading = false;
                }
                this.cdr.detectChanges();
              },
              error: () => {
                votersLoaded++;
                if (votersLoaded === totalElections) {
                  this.isVotersLoading = false;
                }
                this.cdr.detectChanges();
              }
            });
          });
        }
        this.cdr.detectChanges();
        this.message.success('Lấy danh sách cuộc bầu cử thành công!');
      },
      error: (err) => {
        this.isLoading = false;
        this.isCandidatesLoading = false;
        this.isVotersLoading = false;
        this.message.error('Lỗi hệ thống');
      }
    });
  }

  openDetail(id: any) {
    this.router.navigate([`/slection-follow/detail/${id}`]);
  }

  handleChangeVotingVisible(data: any) {
    this.isVisibleEvoting = data.visible;
  }

  openDetailPopup(id?: string) {
    this.isVisibleDetail = true;
    this.idCtv = id;
  }
  handleChangeDetailVisible(data: any) {
    this.isVisibleDetail = data.visible;
  }

  handleCancel() {
    this.form.reset({ emitEvent: true });
    this.handleSearch();
  }  handleSearch() {
    const formValue = this.form.value;
    const nameFilter = formValue.name?.toLowerCase().trim() || '';
    const statusFilter = formValue.status;

    // Nếu không có bộ lọc nào, hiển thị tất cả
    if (!nameFilter && !statusFilter) {
      this.filteredListVote = [...this.originalListVote];
      return;
    }

    // Lọc dữ liệu dựa trên các tiêu chí
    this.filteredListVote = this.originalListVote.filter(vote => {
      const matchesName = !nameFilter || 
        vote.voteName?.toLowerCase().includes(nameFilter) ||
        vote.tenure?.toLowerCase().includes(nameFilter) ||
        vote.description?.toLowerCase().includes(nameFilter);
      
      const matchesStatus = !statusFilter || vote.status === statusFilter;

      return matchesName && matchesStatus;
    });
  }
}
