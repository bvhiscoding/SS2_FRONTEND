import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { ApexLegend, ApexStroke, ChartComponent, NgApexchartsModule } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

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
  selector: 'app-chart-circle-evoting',
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './chart-circle-evoting.component.html',
  styleUrl: './chart-circle-evoting.component.scss'
})
export class ChartCircleEvotingComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() listCandidate: any = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie",
        dropShadow: {
          enabled: true,            
          top: 3,                 
          left: 3,                 
          blur: 5,                 
          opacity: 0.5           
        }
      },
      labels: [],
      colors: [],
      legend: {
        position: "bottom",       // Đặt chú thích ở dưới biểu đồ
        horizontalAlign: "left",  // Căn chỉnh chú thích về bên trái
        floating: false,          // Chú thích không nổi
        fontSize: '14px',
        itemMargin: {
          vertical: 5            // Khoảng cách dọc giữa các phần tử
        }
      },
      stroke: {
        show: false // Tắt viền giữa các phần của biểu đồ
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listCandidate'] && this.listCandidate) {
      // Truy xuất danh sách fullName và thiết lập labels
      const labels = this.listCandidate.map((candidate: any) => candidate.fullName);

      // Tạo series giả định (ví dụ: số phiếu bầu)
      const series = this.listCandidate.map((candidate: any) => candidate.totalBallot);

      // Tạo mảng màu sắc ngẫu nhiên tương ứng
      const colors = labels.map(() => this.getRandomColor());

      // Cập nhật biểu đồ
      this.chartOptions = {
        ...this.chartOptions,
        labels,
        series,
        colors
      };
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
