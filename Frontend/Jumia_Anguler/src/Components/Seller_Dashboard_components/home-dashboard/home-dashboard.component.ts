import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-home-dashboard',
  imports: [HttpClientModule, CommonModule],
  standalone: true, 
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements AfterViewInit{
 // Sample data - Replace with API data later
 dashboardStats = {
  revenue: '$68.250.000',
  income: '$52.755.500',
  orders: '57.251',
  topProducts: [
    { name: 'Pisang Kepok', price: '$25,000', sold: '10,903', trend: '+22%' },
    { name: 'Kelapa Ijo', price: '$35,000', sold: '8,667', trend: '+5.2%' },
    { name: 'Semangka Raja', price: '$35,000', sold: '5,364', trend: '+72%' },
    { name: 'Apel Malang', price: '$45,000', sold: '1,234', trend: '+2.2%' }
  ],
  transactions: [
    { product: 'Pisang Kepok', id: '7434JKJ3276', date: '15 Feb 2023', amount: '$2.225,000', buyer: 'Raja Mexico', status: 'Paid' },
    { product: 'Kelapa Ijo', id: '4H538283421', date: '15 Feb 2023', amount: '$315,000', buyer: 'Max Verstappen', status: 'Paid' }
  ]
};

ngAfterViewInit(): void {
  this.initChart();
}

private initChart(): void {
  const ctx = document.getElementById('balanceChart') as HTMLCanvasElement;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Current',
          data: [45, 60, 75, 80, 65, 70, 85],
          backgroundColor: 'rgba(255, 121, 0, 0.1)',
          borderColor: '#FF7900',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Previous',
          data: [30, 45, 60, 50, 55, 60, 70],
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
}
