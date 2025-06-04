import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PagiComponent } from '../../../../shared/components/pagi/pagi.component';
import { ChartEvotingComponent } from '../../../slection-evoting/result-evoting/chart-evoting/chart-evoting.component';
import { ChartCircleEvotingComponent } from '../../../slection-evoting/result-evoting/chart-circle-evoting/chart-circle-evoting.component';
import { VoteService } from '../../../../core/api/vote.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-slection-follow-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzSpinModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ChartEvotingComponent,
    ChartCircleEvotingComponent
  ],
  templateUrl: './slection-follow-detail.component.html',
  styleUrl: './slection-follow-detail.component.scss'
})
export class SlectionFollowDetailComponent {
  public chartType: any = 'columns'
  public type: any = 'candidate'
  public isLoading: boolean = false;
  isCandidateDataReady = false; 
  public idVote: any = '';
  public infoVote: any = {};
  public leadingCandidate: any = null;
  public totalCount: number = 10;
  maxheight: string = '';
  public param = {
    pageNumber: 1,
    pageSize: 10,
  };

  public listCandidate: any = [];
  public listVoters: any = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
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

  handleChangeChart(name: string) {
    this.chartType = name;
  }

  handleChangeTable(name: string) {
    this.type = name;
  }
}
