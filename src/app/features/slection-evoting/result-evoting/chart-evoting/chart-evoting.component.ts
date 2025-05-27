import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
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
  ApexStroke
} from "ng-apexcharts";

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
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './chart-evoting.component.html',
  styleUrl: './chart-evoting.component.scss'
})
export class ChartEvotingComponent implements OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() listCandidate: any = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Số lượng phiếu bầu",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false 
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top" 
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toString();
        },
        offsetY: -20,
        style: {
          fontSize: "14px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [],
        position: "top",
        labels: {
          offsetY: -2
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        colors: ["#01579B"],
        type: "solid"
      },
      yaxis: {
        max: 12,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true,
          formatter: function(val) {
            return val.toString();
          }
        }
      },
      title: {
        text: "Biểu đồ cột thống kê số lượng phiếu bầu cử",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444"
        }
      }
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listCandidate'] && this.listCandidate) {
      // Lấy danh sách fullName từ listCandidate
      const candidateNames = this.listCandidate.map((candidate: any) => candidate.fullName);
  
      // Lấy danh sách totalBallot từ listCandidate
      const totalBallots = this.listCandidate.map((candidate: any) => candidate.totalBallot);
  
      // Cập nhật categories và series trong chartOptions
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions?.xaxis,
          categories: candidateNames,
        },
        series: [
          {
            ...this.chartOptions?.series,
            data: totalBallots,
          },
        ],
      };
    }
  }
  
} 
