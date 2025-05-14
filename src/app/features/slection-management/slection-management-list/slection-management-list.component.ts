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
import { SlectionManagementAddComponent } from '../slection-management-add/slection-management-add.component';
import { PopupDeleteComponent } from '../popup-delete/popup-delete.component';
import { DetailCtvComponent } from './detail-ctv/detail-ctv.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-slection-management-list',
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
    SlectionManagementAddComponent,
    PopupDeleteComponent,
    DetailCtvComponent
  ],
  templateUrl: './slection-management-list.component.html',
  styleUrl: './slection-management-list.component.scss'
})
export class SlectionManagementListComponent implements OnInit{
  public isLoading: boolean = false;
  public isVisibleDetail: boolean = false;
  public idCtv: any = '';
  public mode: 'create' | 'edit' = 'create';
  public totalCount: number = 10;
  public idSlectionManagement: any = '';
  public nameSlection: any = '';
  public selectedView: string = 'candidate'; 
  public listVote: any = [];
  public isCandidatesLoading: boolean = true;
  public isVotersLoading: boolean = true;
  get isLoadingOK(): boolean {
    return this.isCandidatesLoading || this.isVotersLoading;
  }

  public listStatus: any = [
    {
      label: 'Chưa bắt đầu',
      value: '0'
    },
    {
      label: 'Đang diễn ra',
      value: '1'
    },
    {
      label: 'Đã kết thúc',
      value: '2'
    },
  ];
  public searchQuery: string = '';
  public role: string;

  form: FormGroup = this.fb.group({
    name: [''],
    status: [null],
  });


  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private voteService: VoteService,
    private message: NzMessageService,
  ){}
  
  ngOnInit(): void {
    this.viewListVote();
  }

  selectView(view: string): void {
    this.selectedView = view;
  }

  listVoter(id: any) {
    this.voteService.listViewVoter(id).subscribe({
      next: (res) => {
        this.cdr.detectChanges();
      },
    });
  }

  listCandidates(id: any) {
    this.voteService.listViewCandidate(id).subscribe({
      next: (res) => {
        this.cdr.detectChanges();
      },
    });
  }

  viewListVote() {
    this.isLoading = true;
    this.voteService.viewListVote().subscribe({
      next: (res) => {
        this.listVote = res.data.map((vote: any) => {
          return {
            ...vote,
            candidates: [], // Khởi tạo danh sách ứng viên
            voters: []      // Khởi tạo danh sách cử tri
          };
        });
        
        // Tải danh sách ứng viên và cử tri cho mỗi cuộc bầu cử
        this.listVote.forEach((vote: any) => {
          this.voteService.listViewCandidate(vote.id).subscribe({
            next: (candidateRes) => {
              vote.candidates = candidateRes.data;
              this.cdr.detectChanges();
              this.isCandidatesLoading = false;
            }
          });
          this.voteService.listViewVoter(vote.id).subscribe({
            next: (voterRes) => {
              vote.voters = voterRes.data;
              this.cdr.detectChanges();
              this.isVotersLoading = false;
            }
          });
        });
  
        this.totalCount = res.totalItems;
        this.cdr.detectChanges();
        this.message.success('Lấy danh sách cuộc bầu cử thành công!');
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error('Lỗi hệ thống');
      }
    });
  }
  

  isVisiblePopUpAddSlectionManagement: boolean = false;
  handelVisiblePopUpAddSlectionManagement(e: boolean) {
    this.isVisiblePopUpAddSlectionManagement = e;
    this.viewListVote();
    this.cdr.detectChanges();
  }
  handelOpenPopUpAddSlectionManagement() {
    this.mode = 'create';
    this.idSlectionManagement = null;
    this.isVisiblePopUpAddSlectionManagement = true;
    this.cdr.detectChanges();
  }

  handelOpenPopUpSlectionManagement(id: string) {
    this.mode = 'edit';
    this.idSlectionManagement = id;
    this.isVisiblePopUpAddSlectionManagement = true;
    this.cdr.detectChanges();
  }

  openDeletePopup(id?: string, name?: any) {
    this.isVisible = true;
    this.nameSlection = name;
    this.idSlectionManagement = id;
  }
  isVisible: boolean = false;
  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
    if (data.isSuccess == true) {
      this.viewListVote();
    }
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
