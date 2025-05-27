import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ManagermentService } from '../../../core/api/managerment.service';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DetailCtvComponent } from '../../slection-management/slection-management-list/detail-ctv/detail-ctv.component';
import { ProceedEvotingComponent } from '../proceed-evoting/proceed-evoting.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
    MatDatepickerModule,
    MatSelectModule,
    DetailCtvComponent,
    ProceedEvotingComponent
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
  public numberVote: any;
  public mode: 'create' | 'edit' = 'create';
  public totalCount: number = 10;
  public idSlectionManagement: any = '';
  public listUserManagements: any = [];
  public listVote: any[] = [];
  public listStatus: any[] = [
    {
      label: 'Đang hoạt động',
      value: 'Active'
    },
    {
      label: 'Hết hạn',
      value: 'Disable'
    },
  ];
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
  ){}
  
  ngOnInit(): void {
    this.viewListVote();
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
        }

        this.listVote = res.data.map((vote: any) => ({
          ...vote,
          candidates: [], 
          voters: []      
        }));
        
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

  }
}
