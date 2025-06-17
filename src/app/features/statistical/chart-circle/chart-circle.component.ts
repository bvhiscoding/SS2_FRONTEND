import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ApexLegend,
  ApexStroke,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-chart-circle',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart-circle.component.html',
  styleUrl: './chart-circle.component.scss',
})
export class ChartCircleComponent implements OnChanges {
  @ViewChild('chart') chart: ChartComponent;
  @Input() listDetailVote: any;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: 'pie',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 3,
          blur: 5,
          opacity: 0.5,
        },
      },
      labels: [],
      colors: [],
      legend: {
        position: 'bottom', // Đặt chú thích ở dưới biểu đồ
        horizontalAlign: 'left', // Căn chỉnh chú thích về bên trái
        floating: false, // Chú thích không nổi
        fontSize: '14px',
        itemMargin: {
          vertical: 5, // Khoảng cách dọc giữa các phần tử
        },
      },
      stroke: {
        show: false, // Tắt viền giữa các phần của biểu đồ
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listDetailVote']) {
      console.log('Circle chart data received:', this.listDetailVote);

      if (this.listDetailVote && this.listDetailVote.length > 0) {
        // Truy xuất danh sách fullName và thiết lập labels
        const labels = this.listDetailVote.map(
          (candidate: any) => candidate.fullName || 'Unknown',
        );

        // Tạo series giả định (ví dụ: số phiếu bầu)
        const series = this.listDetailVote.map(
          (candidate: any) => candidate.totalBallot || 0,
        );

        // Tạo mảng màu sắc ngẫu nhiên tương ứng
        const colors = labels.map(() => this.getRandomColor());

        console.log('Circle chart - Labels:', labels);
        console.log('Circle chart - Series:', series);
        console.log('Circle chart - Colors:', colors);

        // Cập nhật biểu đồ
        this.chartOptions = {
          ...this.chartOptions,
          labels,
          series,
          colors,
        };
      } else {
        // Display empty chart when no data
        this.chartOptions = {
          ...this.chartOptions,
          labels: [],
          series: [],
          colors: [],
        };
      }
    }
  }

  /**
   * Hàm tạo màu ngẫu nhiên
   */
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
