import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  NgApexchartsModule,
  ApexStroke,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-chart-evoting',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-evoting.component.html',
  styleUrl: './chart-evoting.component.scss',
})
export class ChartEvotingComponent implements OnChanges {
  @ViewChild('chart') chart: ChartComponent;
  @Input() listDetailVote: any = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Số lượng phiếu bầu',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toString();
        },
        offsetY: -20,
        style: {
          fontSize: '14px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        categories: [],
        position: 'top',
        labels: {
          offsetY: -2,
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        colors: ['#01579B'],
        type: 'solid',
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val ? val.toString() : '0';
          },
        },
      },
      title: {
        text: 'Biểu đồ cột thống kê số lượng phiếu bầu cử',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listDetailVote'] && this.listDetailVote) {
      console.log('Chart data received:', this.listDetailVote);

      // Lấy danh sách fullName từ listDetailVote
      const candidateNames = this.listDetailVote.map(
        (candidate: any) => candidate.fullName,
      );

      // Lấy danh sách totalBallot từ listDetailVote
      const totalBallots = this.listDetailVote.map(
        (candidate: any) => candidate.totalBallot,
      );

      console.log('Candidate names:', candidateNames);
      console.log('Total ballots:', totalBallots);

      // Cập nhật categories và series trong chartOptions
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions?.xaxis,
          categories: candidateNames,
        },
        series: [
          {
            name: 'Số lượng phiếu bầu',
            data: totalBallots,
          },
        ],
      };

      console.log('Updated chart options:', this.chartOptions);
    }
  }
}
