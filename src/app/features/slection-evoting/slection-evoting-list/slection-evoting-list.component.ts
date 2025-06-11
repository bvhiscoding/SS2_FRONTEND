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
import { ProceedEvotingComponent } from '../proceed-evoting/proceed-evoting.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-slection-evoting-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    ShareTableModule,
    RouterModule,
    NzIconModule,
    NzSpinModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,    MatSelectModule,
    DetailCtvComponent,
    ProceedEvotingComponent,
    UserAvatarComponent
  ],
  templateUrl: './slection-evoting-list.component.html',
  styleUrl: './slection-evoting-list.component.scss'
})
export class SlectionEvotingListComponent {
  public isLoading: boolean = false;
  public isVisibleDetail: boolean = false;
  public isVisibleEvoting: boolean = false;
  public idCtv: any = '';
  public idEvoting: any = '';
  public nameEvoting: any = '';
  public numberVote: any;  public mode: 'create' | 'edit' = 'create';
  public totalCount: number = 10;
  public idSlectionManagement: any = '';
  public listUserManagements: any = [];
  public listVote: any[] = [];  public filteredListVote: any[] = []; // Danh sách đã được lọc
  public originalListVote: any[] = []; // Danh sách gốc để backup
  public listStatus: any[] = [];
  public searchQuery: string = '';
  public role: string;
  public isCandidatesLoading: boolean = true;
  public isVotersLoading: boolean = true;
  get isLoadingOK(): boolean {
    return this.isLoading || this.isCandidatesLoading || this.isVotersLoading;
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
    this.initializeTranslatedLists();
    this.viewListVote();
  }

  private initializeTranslatedLists(): void {
    this.listStatus = [
      {
        label: this.translate.instant('Statistics.notStarted'),
        value: '0'
      },
      {
        label: this.translate.instant('ProceedVoting.ongoing'),
        value: '1'
      },
      {
        label: this.translate.instant('ProceedVoting.completed'),
        value: '2'
      },
    ];
  }

  viewListVote() {
    this.isLoading = true;
    this.isCandidatesLoading = true;
    this.isVotersLoading = true;
    
    this.voteService.viewListVoteForUser().subscribe({
      next: (res) => {
        if(!res.data || res.data.length === 0) {
          this.listVote = [];
          this.isLoading = false;
          this.isCandidatesLoading = false;
          this.isVotersLoading = false;
          this.cdr.detectChanges();
          return;
        }        this.listVote = res.data.map((vote: any) => ({
          ...vote,
          candidates: [], 
          voters: []      
        }));
        
        // Backup dữ liệu gốc để tìm kiếm
        this.originalListVote = [...this.listVote];
        this.filteredListVote = [...this.listVote];
        
        // Tạo mảng các Promise để xử lý song song các API call
        const candidatePromises = this.listVote.map((vote: any) => 
          this.voteService.listViewCandidate(vote.id).toPromise()
        );
        const voterPromises = this.listVote.map((vote: any) => 
          this.voteService.listViewVoter(vote.id).toPromise()
        );

        // Xử lý song song các API call
        Promise.all([...candidatePromises, ...voterPromises])
          .then(results => {
            const candidateResults = results.slice(0, this.listVote.length);
            const voterResults = results.slice(this.listVote.length);

            // Cập nhật dữ liệu ứng viên
            candidateResults.forEach((res: any, index: number) => {
              if (res && res.data) {
                this.listVote[index].candidates = res.data;
              }
            });

            // Cập nhật dữ liệu cử tri
            voterResults.forEach((res: any, index: number) => {
              if (res && res.data) {
                this.listVote[index].voters = res.data;
              }
            });

            this.totalCount = res.totalItems;
            this.isLoading = false;
            this.isCandidatesLoading = false;
            this.isVotersLoading = false;
            this.cdr.detectChanges();
            this.message.success('Lấy danh sách cuộc bầu cử thành công!');
          })
          .catch(error => {
            console.error('Error loading data:', error);
            this.isLoading = false;
            this.isCandidatesLoading = false;
            this.isVotersLoading = false;
            this.message.error('Lỗi hệ thống');
            this.cdr.detectChanges();
          });
      },
      error: (err) => {
        console.error('Error loading vote list:', err);
        this.isLoading = false;
        this.isCandidatesLoading = false;
        this.isVotersLoading = false;
        this.message.error('Lỗi hệ thống');
        this.cdr.detectChanges();
      }
    });
  }

  openResult(id: any) {
    this.router.navigate([`/slection-ticket/result/${id}`]);
  }

  openEvotingPopup(id: string, name?: string, numberVote?: any, status?: any) {
    this.idEvoting = id;
    this.nameEvoting = name;
    this.numberVote = numberVote;
    if(status === '0') {
      this.message.warning('Cuộc bầu cử chưa được kích hoạt. Không thể tiến hành.');
    } else if(status === '2') {
      this.message.warning('Cuộc bầu cử đã hết hạn. Không thể tiến hành.');
    } else if (status === '1') {
      this.isVisibleEvoting = true;
    }
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
  }

  handleSearch() {
    const searchName = this.form.get('name')?.value?.toLowerCase().trim() || '';
    const searchStatus = this.form.get('status')?.value || '';

    // Nếu không có dữ liệu gốc, sử dụng listVote hiện tại
    const dataToFilter = this.originalListVote.length > 0 ? this.originalListVote : this.listVote;

    this.filteredListVote = dataToFilter.filter((vote: any) => {
      // Lọc theo tên
      const matchName = !searchName || 
        vote.voteName?.toLowerCase().includes(searchName) ||
        vote.tenure?.toLowerCase().includes(searchName);

      // Lọc theo trạng thái
      const matchStatus = !searchStatus || vote.status === searchStatus;

      return matchName && matchStatus;
    });

    // Cập nhật listVote để hiển thị
    this.listVote = [...this.filteredListVote];
    this.cdr.detectChanges();
  }
}
