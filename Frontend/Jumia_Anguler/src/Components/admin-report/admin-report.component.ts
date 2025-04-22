import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { AdminDashboard } from '../interfaces/dashboard-stats';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './admin-report.component.html',
  styleUrl: './admin-report.component.css'
})
export class AdminReportComponent implements OnInit {
  dashboardData: AdminDashboard = {
    totalUsers: 0,
    totalCategories: 0,
    totalSubCategories: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    newUsersThisMonth: 0,
    totalSales: 0,
    totalCommission: 0
  };

  // Chart options
  growthVsSalesOptions: EChartsOption = {};
  categoryEfficiencyOptions: EChartsOption = {};
  profitabilityOptions: EChartsOption = {};
  inventoryRiskOptions: EChartsOption = {};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    // In a real app, use the service to get data
    // this.adminService.getDashboardData().subscribe(data => {
    //   this.dashboardData = data;
    //   this.initCharts();
    // });

    // Simulated data for demo
    this.dashboardData = {
      totalUsers: 1250,
      totalCategories: 12,
      totalSubCategories: 45,
      totalProducts: 876,
      outOfStockProducts: 67,
      newUsersThisMonth: 84,
      totalSales: 125000,
      totalCommission: 18750
    };
    this.initCharts();
  }

  initCharts(): void {
    this.growthVsSalesOptions = this.getGrowthVsSalesOptions();
    this.categoryEfficiencyOptions = this.getCategoryEfficiencyOptions();
    this.profitabilityOptions = this.getProfitabilityOptions();
    this.inventoryRiskOptions = this.getInventoryRiskOptions();
  }

  private getGrowthVsSalesOptions(): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['User Growth', 'Sales Performance', 'Efficiency Ratio']
      },
      xAxis: [
        {
          type: 'category',
          data: ['Last Month', 'Current Month', 'Growth Rate'],
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          min: 0
        },
        {
          type: 'value',
          name: 'Ratio',
          min: 0,
          max: 1
        }
      ],
      series: [
        {
          name: 'User Growth',
          type: 'bar',
          data: [
            this.dashboardData.totalUsers - this.dashboardData.newUsersThisMonth,
            this.dashboardData.newUsersThisMonth,
            this.dashboardData.newUsersThisMonth / (this.dashboardData.totalUsers - this.dashboardData.newUsersThisMonth)
          ]
        },
        {
          name: 'Sales Performance',
          type: 'bar',
          data: [
            this.dashboardData.totalSales * 0.8, // Simulated last month data
            this.dashboardData.totalSales,
            this.dashboardData.totalSales / (this.dashboardData.totalSales * 0.8)
          ]
        },
        {
          name: 'Efficiency Ratio',
          type: 'line',
          yAxisIndex: 1,
          data: [
            0.75, // Simulated last month efficiency
            this.dashboardData.totalSales / this.dashboardData.totalProducts,
            null
          ]
        }
      ]
    };
  }

  private getCategoryEfficiencyOptions(): EChartsOption {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['Products per Main Category', 'Products per Subcategory']
      },
      series: [
        {
          name: 'Category Efficiency',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: this.dashboardData.totalProducts / this.dashboardData.totalCategories,
              name: 'Products per Main Category' 
            },
            { 
              value: this.dashboardData.totalProducts / this.dashboardData.totalSubCategories,
              name: 'Products per Subcategory' 
            }
          ]
        }
      ]
    };
  }

  private getProfitabilityOptions(): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['Total Sales', 'Total Commission', 'Net Profit']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Total Sales',
          type: 'line',
          stack: 'total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this.generateSalesTrendData()
        },
        {
          name: 'Total Commission',
          type: 'line',
          stack: 'total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this.generateCommissionTrendData()
        },
        {
          name: 'Net Profit',
          type: 'line',
          stack: 'total',
          label: {
            show: true,
            position: 'top'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: this.generateProfitTrendData()
        }
      ]
    };
  }

  private getInventoryRiskOptions(): EChartsOption {
    const outOfStockPercentage = parseFloat(
      (this.dashboardData.outOfStockProducts / this.dashboardData.totalProducts * 100)
      .toFixed(1)
    );

    return {
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'gauge',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          distance: -30,
          length: 8,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: -30,
          length: 30,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'auto',
          distance: 40,
          fontSize: 12
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: 'auto',
          fontSize: 20,
          offsetCenter: [0, '70%']
        },
        data: [{
          value: outOfStockPercentage
        }]
      }]
    };
  }

  private generateSalesTrendData(): number[] {
    const base = this.dashboardData.totalSales / 7;
    return Array(7).fill(0).map((_, i) => Math.round(base * (0.7 + Math.random() * 0.6)));
  }

  private generateCommissionTrendData(): number[] {
    const base = this.dashboardData.totalCommission / 7;
    return Array(7).fill(0).map((_, i) => Math.round(base * (0.7 + Math.random() * 0.6)));
  }

  private generateProfitTrendData(): number[] {
    const sales = this.generateSalesTrendData();
    const commission = this.generateCommissionTrendData();
    return sales.map((val, i) => val - commission[i]);
  }
}