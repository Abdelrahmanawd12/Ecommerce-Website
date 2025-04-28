import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { AdminDashboard } from '../interfaces/dashboard-stats';
import { AdminService } from '../../Services/AdminServ/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  isRefreshing = false;
  showDateDropdown = false;
  selectedDateRange = 'Last 30 days';
  
 
  originalStats!: AdminDashboard;
  filteredStats!: AdminDashboard;

 
  userGrowthChartOptions: any;
  inventoryChartOptions: any;
  salesChartOptions: any;
  categoriesChartOptions: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }


  loadInitialData(): void {
    this.isRefreshing = true;
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        console.log('API Response:', data);
        this.originalStats = data;
        this.applyDateRangeFilter();
        this.isRefreshing = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.isRefreshing = false;
      }
    });
  }

  applyDateRangeFilter(): void {
 
    this.filteredStats = {...this.originalStats};
    

    const filterFactor = this.calculateFilterFactor();
    
 
    this.filteredStats.newUsersThisMonth = Math.round(this.originalStats.newUsersThisMonth * filterFactor.userFactor);
    this.filteredStats.totalSales = this.originalStats.totalSales * filterFactor.salesFactor;
    this.filteredStats.totalCommission = this.originalStats.totalCommission * filterFactor.salesFactor;
    

    this.initAllCharts();
  }


  private calculateFilterFactor(): { userFactor: number, salesFactor: number } {
    switch(this.selectedDateRange) {
      case 'Last 7 days':
        return { userFactor: 0.25, salesFactor: 0.25 };
      case 'Last 30 days':
        return { userFactor: 1, salesFactor: 1 };
      case 'Last 90 days':
        return { userFactor: 2, salesFactor: 3 };
      case 'This Year':
        return { userFactor: 5, salesFactor: 12 };
      default:
        return { userFactor: 1, salesFactor: 1 };
    }
  }


  
  refreshData(): void {
    this.isRefreshing = true;
    this.loadInitialData();
  }

  changeDateRange(range: string): void {
    this.selectedDateRange = range;
    this.showDateDropdown = false;
    this.applyDateRangeFilter();
  }

  toggleDateDropdown(): void {
    this.showDateDropdown = !this.showDateDropdown;
  }


  private initAllCharts(): void {
    this.initUserGrowthChart();
    this.initInventoryChart();
    this.initSalesChart();
    this.initCategoriesChart();
  }

  private initUserGrowthChart(): void {
    this.userGrowthChartOptions = {
      title: {
        text: 'User Growth',
        left: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}<br/>{a0}: {c0}<br/>{a1}: {c1}'
      },
      legend: {
        data: ['Total Users', 'New This Month'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#ecf0f1' } },
        axisLabel: { color: '#7f8c8d' },
        splitLine: { lineStyle: { color: '#f1f1f1' } }
      },
      yAxis: {
        type: 'category',
        data: ['Users'],
        axisLine: { lineStyle: { color: '#ecf0f1' } },
        axisLabel: { color: '#7f8c8d' }
      },
      series: [
        {
          name: 'Total Users',
          type: 'bar',
          barWidth: '30%',
          data: [this.filteredStats.totalUsers],
          itemStyle: {
            color: '#F68B1E',
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'right',
            color: '#4CAF50',
          }
        },
        {
          name: 'New This Month',
          type: 'bar',
          barWidth: '30%',
          data: [this.filteredStats.newUsersThisMonth],
          itemStyle: {
            color: '#2ecc71',
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'right',
            color: '#2c3e50'
          }
        }
      ]
    };
  }

  private initInventoryChart(): void {
    this.inventoryChartOptions = {
      title: {
        text: 'Inventory Overview',
        left: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['In Stock', 'Out of Stock'],
        textStyle: { color: '#7f8c8d' }
      },
      series: [
        {
          name: 'Inventory Status',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: '#7c8e50'
            }
          },
          labelLine: { show: false },
          data: [
            { 
              value: this.filteredStats.totalProducts - this.filteredStats.outOfStockProducts, 
              name: 'In Stock',
              itemStyle: { color: '#FF9800' }
            },
            { 
              value: this.filteredStats.outOfStockProducts, 
              name: 'Out of Stock',
              itemStyle: { color: '#9E9E9E' }
            }
          ]
        }
      ]
    };
  }

  private initSalesChart(): void {
    this.salesChartOptions = {
      title: { 
        text: 'Sales & Commission',
        left: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: { trigger: 'axis' },
      xAxis: { 
        type: 'category', 
        data: ['Total Sales', 'Platform Commission'],
        axisLabel: { color: '#7f8c8d' }
      },
      yAxis: { 
        type: 'value',
        axisLabel: { color: '#7f8c8d' }
      },
      series: [{
        name: 'Amount',
        type: 'bar',
        data: [
          { 
            value: this.filteredStats.totalSales, 
            itemStyle: { color: '#F57C00' },
            label: {
              show: true,
              position: 'top',
              formatter: (params: any) => {
                return '$' + params.value.toLocaleString();
              }
            }
          },
          { 
            value: this.filteredStats.totalCommission, 
            itemStyle: { color: '#7B1FA2' },
            label: {
              show: true,
              position: 'top',
              formatter: (params: any) => {
                return '$' + params.value.toLocaleString();
              }
            }
          }
        ]
      }]
    };
  }

  private initCategoriesChart(): void {
    this.categoriesChartOptions = {
      title: { 
        text: 'Categories Breakdown',
        left: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: { 
        trigger: 'item', 
        formatter: '{b}: {c}' 
      },
      xAxis: { 
        type: 'category', 
        data: ['Categories', 'Subcategories'],
        axisLabel: { color: '#7f8c8d' }
      },
      yAxis: { 
        type: 'value',
        axisLabel: { color: '#7f8c8d' }
      },
      series: [{
        name: 'Count',
        type: 'bar',
        data: [
          { 
            value: this.filteredStats.totalCategories, 
            itemStyle: { color: '#FF7043' },
            label: {
              show: true,
              position: 'top'
            }
          },
          { 
            value: this.filteredStats.totalSubCategories, 
            itemStyle: { color: '#8D6E63' },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }]
    };
  }
}