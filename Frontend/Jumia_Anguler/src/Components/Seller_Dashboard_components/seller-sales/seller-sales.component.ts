import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SellerService } from '../../../Services/SellerServ/seller.service';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './seller-sales.component.html',
  styleUrls: ['./seller-sales.component.css']
})
export class SellerSalesComponent implements OnInit {
  private salesChart: any;
  private categoryChart: any;
  private topProductsChart: any;
  private revenueChart: any;

  constructor(private sellerService: SellerService) {
    Chart.register(...registerables);
  }
  

  ngOnInit(): void {
    this.loadTopProductsData();
    this.createSalesChart();
    this.createCategoryChart();
    this.createRevenueChart();
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(255, 193, 7, 0.2)',
          borderColor: 'rgba(255, 152, 0, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  loadTopProductsData(): void {
    this.sellerService.getProductSales().subscribe(data => {
      const labels = data.map(p => p.ProductName);
      const values = data.map(p => p.sales);
  
      this.createTopProductsChart(labels, values);
    });
  }
  

  createCategoryChart(): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Other'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#3f51b5',
            '#2196f3',
            '#00bcd4',
            '#4caf50',
            '#ff9800'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        },
        cutout: '70%'
      }
    });
  }
  createTopProductsChart(labels: string[], values: number[]): void {
    const ctx = document.getElementById('topProductsChart') as HTMLCanvasElement;
    this.topProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Units Sold',
          data: values,
          backgroundColor: 'rgba(0, 188, 212, 0.7)',
          borderColor: 'rgba(0, 151, 167, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
  

  createRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: '2023 Revenue',
          data: [50000, 75000, 60000, 90000],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: true
        },
        {
          label: '2022 Revenue',
          data: [40000, 65000, 55000, 80000],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': $' + (context.raw as number).toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            },
            grid: {
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.salesChart) this.salesChart.destroy();
    if (this.categoryChart) this.categoryChart.destroy();
    if (this.topProductsChart) this.topProductsChart.destroy();
    if (this.revenueChart) this.revenueChart.destroy();
  }
}