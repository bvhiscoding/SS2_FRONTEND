import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartColumnsComponent } from '../chart-columns/chart-columns.component';
import { ChartCircleComponent } from '../chart-circle/chart-circle.component';
import { SheducerComponent } from '../sheducer/sheducer.component';
import { PagiComponent } from '../../../shared/components/pagi/pagi.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { VoteService } from '../../../core/api/vote.service';
import { Router, RouterModule } from '@angular/router';
import { ManagermentService } from '../../../core/api/managerment.service';
import { PositionService } from '../../../core/api/position.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-statistical-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChartColumnsComponent,
    ChartCircleComponent,
    SheducerComponent,
    PagiComponent,
    NzSpinModule,
    TranslateModule,
  ],
  templateUrl: './statistical-list.component.html',
  styleUrl: './statistical-list.component.scss',
})
export class StatisticalListComponent implements OnInit {
  public chartType: any = 'columns';
  public isLoading: boolean = false;
  public totalCount: number = 0;
  public totalUser: number = 0;
  public totalPosition: number = 0;
  public totalListVote: number = 0;
  public idOwner: any;
  public nameOwner: any;
  public canActive: boolean = false;
  public role: string;
  public selectedVoteId: string | null = null;
  public param = {
    pageNumber: 1,
    pageSize: 10,
  };
  public slectionArray: any = [];
  public listDetailVote: any = [];
  public chartAnimationComplete: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private voteService: VoteService,
    private message: NzMessageService,
    private router: Router,
    private managermentService: ManagermentService,
    private positionService: PositionService,
  ) {}
  ngOnInit(): void {
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    this.nameOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.name;
    this.role = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.role;

    console.log('User role:', this.role);

    if (this.role[0] === 'Administrator') {
      this.canActive = true;
      this.viewVoteforAdmin();
      this.viewListUser();
      this.viewListPosition();
      this.viewListVote();
    } else if (this.role[0] === 'User') {
      this.canActive = false;
      this.viewVoteHistory();
    }
  }
  viewVoteforAdmin() {
    this.voteService.viewListVote().subscribe({
      next: (res) => {
        console.log('Vote list response:', res);
        this.slectionArray = res.data;
        console.log('Elections loaded:', this.slectionArray);
      },
      error: (err) => {
        console.error('Error loading elections:', err);
        this.message.error('Lỗi hệ thống');
      },
    });
  }
  viewVoteHistory() {
    this.voteService
      .viewListVoteHistory(this.param.pageNumber, this.param.pageSize)
      .subscribe({
        next: (res) => {
          console.log('Vote history response:', res);
          this.slectionArray = res.data.data;
          this.totalCount = res.data.totalItems;
          console.log('Vote history loaded:', this.slectionArray);
        },
        error: (err) => {
          console.error('Error loading vote history:', err);
          this.message.error('Lỗi hệ thống');
        },
      });
  }
  selectVote(voteId: string): void {
    this.selectedVoteId = voteId;
    this.chartAnimationComplete = false;

    this.voteService.listViewCandidate(voteId).subscribe({
      next: (candidateRes) => {
        console.log('API Response:', candidateRes);
        this.listDetailVote = candidateRes.data;
        console.log('List Detail Vote:', this.listDetailVote);
        setTimeout(() => (this.chartAnimationComplete = true), 300);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading candidate data:', err);
        this.message.error('Không thể tải dữ liệu ứng viên');
      },
    });
  }

  infoVote(voteId: string, role: string): void {
    if (role === 'Voter') {
      this.router.navigate([`/slection-ticket/result/${voteId}`]);
    } else if (role === 'Candidate') {
      this.router.navigate([`/slection-follow/detail/${voteId}`]);
    }
  }

  viewListUser() {
    this.managermentService.getAllManagement(1, 99).subscribe((res) => {
      this.totalUser = res.totalItems;
    });
  }

  viewListPosition() {
    this.positionService.getAllPosition(1, 99).subscribe({
      next: (res) => {
        this.totalPosition = res.totalItems;
      },
    });
  }

  viewListVote() {
    this.isLoading = true;
    this.voteService.viewListVote().subscribe({
      next: (res) => {
        this.totalListVote = res.data.length;
      },
    });
  }

  handleChangeChart(name: string) {
    this.chartType = name;
  }

  currentPage: number = 1;
  itemsPerPage: number = 10;
  changePage(page: number): void {
    this.currentPage = page;
    this.param.pageNumber = page;
  }

  changePageSize(page: number): void {
    if (page) {
      this.itemsPerPage = page;
      this.param.pageSize = page;
    }
  }
}
