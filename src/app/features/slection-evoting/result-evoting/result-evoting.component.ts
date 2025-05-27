import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartEvotingComponent } from './chart-evoting/chart-evoting.component';
import { ChartCircleEvotingComponent } from './chart-circle-evoting/chart-circle-evoting.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShareTableModule } from '../../../shared/components/share-table/share-table.module';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../shared/components/pagi/pagi.component';
import { VoteService } from '../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-result-evoting',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    FormsModule,
    ReactiveFormsModule,
    PagiComponent,
    NzIconModule,
    RouterModule,
    ChartEvotingComponent,
    ChartCircleEvotingComponent
  ],
  templateUrl: './result-evoting.component.html',
  styleUrl: './result-evoting.component.scss'
})
export class ResultEvotingComponent implements OnInit {
  public chartType: any = 'columns'
  public leadingCandidate: any = null;
  public type: any = 'candidate'
  public isLoading: boolean = false;
  isCandidateDataReady = false; 
  public idVote: any = '';
  public infoVote: any = {};
  public totalCount: number = 10;
  maxheight: string = '';
  public param = {
    pageNumber: 1,
    pageSize: 10,
  };

  public listCandidate: any = [];
  public listVoters: any = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private voteService: VoteService,
    private message: NzMessageService,
  ){}
  ngOnInit(): void {
    this.idVote = this.route.snapshot.paramMap.get('id');
    this.viewDetailVote(this.idVote);
  }

  viewDetailVote(id: any) {
    this.voteService.detailVote(id).subscribe({
      next: (res) => {
        this.infoVote = res.data
        if(this.infoVote) {
          this.voteService.listViewCandidate(id).subscribe((candidateRes) => {
            this.listCandidate = candidateRes.data;
            
            this.leadingCandidate = this.listCandidate.reduce((max: any, candidate: any) => 
            candidate.totalBallot > max.totalBallot ? candidate : max
          , this.listCandidate[0]);

            this.isCandidateDataReady = true; 
            this.cdr.detectChanges();
          });
          this.voteService.listViewVoter(id).subscribe((voterRes) => {
            this.listVoters = voterRes.data;
            this.cdr.detectChanges();
          });
        } else {
          this.isCandidateDataReady = false; 
        }
      },
      error: (err) => {
        this.isCandidateDataReady = false; 
        this.message.error('Có lỗi xảy ra, vui lòng thử lại sau!');
      }
    })
  }

  viewInformation() {
    this.isLoading = true;
    // Gọi hàm ra service
  }

  handleChangeChart(name: string) {
    this.chartType = name;
  }

  handleChangeTable(name: string) {
    this.type = name;
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
