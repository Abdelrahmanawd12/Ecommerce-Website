import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { SellerService } from '../../../Services/SellerServ/seller.service';

@Component({
  selector: 'app-home-dashboard',
  imports: [HttpClientModule, CommonModule],
  standalone: true, 
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements AfterViewInit {

  dashboardStats: {
    revenue: string;
    income: string;
    orders: string;
    topProducts: any[];
    transactions: any[];
  } = {
    revenue: '',
    income: '',
    orders: '',
    topProducts: [],
    transactions: []
  };

  chartLabels: string[] = [];
  currentData: number[] = [];
  previousData: number[] = [];

  chartInstance: any = null;

  sellerId = localStorage.getItem('userId');

  constructor(private dashboardService: SellerService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const sellerId = localStorage.getItem('userId')!;

    this.dashboardService.getAllProducts(sellerId).subscribe(products => {
      this.dashboardStats.topProducts = products.slice(0, 4).map(p => ({
        name: p.name,
        price: `$${p.price}`,
        sold: p.quantity,
        trend: '+0%' // Placeholder
      }));
    });

    this.dashboardService.getAllOrders(sellerId).subscribe(orders => {
      this.dashboardStats.orders = orders.length.toString();

      let totalRevenue = 0;
      let recentTx = [];

      for (let order of orders) {
        totalRevenue += order.totalAmount;

        if (recentTx.length < 5 && order.orderItems?.length && order.payment.status.toLowerCase() === 'paid') {
          recentTx.push({
            product: order.orderItems[0].productName,
            id: order.orderId,
            date: new Date(order.orderDate).toLocaleDateString(),
            amount: `$${order.totalAmount}`,
            buyer: order.shippingInfo.receiverName,
            status: order.payment.status
          });
        }        

        const orderMonth = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
        const orderAmount = order.totalAmount;

        if (this.chartLabels.indexOf(orderMonth) === -1) {
          this.chartLabels.push(orderMonth);
          this.currentData.push(orderAmount);
          this.previousData.push(0); 
        } else {
          const index = this.chartLabels.indexOf(orderMonth);
          this.currentData[index] += orderAmount;
        }
      }

      this.dashboardStats.revenue = `$${totalRevenue.toLocaleString()}`;
      this.dashboardStats.income = `$${(totalRevenue * 0.77).toLocaleString()}`;
      this.dashboardStats.transactions = recentTx;

      this.initChart();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const canvas = document.getElementById('balanceChart') as HTMLCanvasElement;
  
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  
    this.chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Current',
            data: this.currentData,
            backgroundColor: 'rgba(255, 121, 0, 0.1)',
            borderColor: '#FF7900',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Previous',
            data: this.previousData,
            backgroundColor: 'rgba(44, 44, 44, 0.05)',
            borderColor: 'rgba(44, 44, 44, 0.3)',
            borderWidth: 1,
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#2D2D2D',
            bodyColor: '#2D2D2D',
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 4
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }  
  getPayStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'paid-status';
      case 'pending':
        return 'pending-status';
      case 'canceled':
        return 'canceled-status';
      default:
        return 'default-status';
    }
  }
}

