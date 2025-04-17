import { Component, OnInit } from '@angular/core';
import { SalesReportService } from '../../../Services/SellerServ/sales-reports.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { ISellerProfit } from '../../../Models/iseller-profit';
import { TopSellingProduct } from '../../../Models/topselling-product';
import { CustomerInsights } from '../../../Models/customer-insights';
import { OrderSummary } from '../../../Models/order-summary';
import { ReturnReport } from '../../../Models/return-report';
import { BestSalesTime } from '../../../Models/sales-timing';

@Component({
  selector: 'app-seller-reports',
  imports: [NgxEchartsModule, CommonModule],
  templateUrl: './seller-reports.component.html',
  styleUrls: ['./seller-reports.component.css']
})
export class SellerReportsComponent implements OnInit {
  sellerId = localStorage.getItem('userId')!;

  // Data holders
  topSellingProducts: TopSellingProduct[] = [];
  ordersSummary: OrderSummary = {
    today: 0,
    weekly: 0,
    monthly: 0
  };
  revenueReport: number = 0;
  customerInsights: CustomerInsights = { totalCustomers: 0, topCustomers: [] };
  returnReport: ReturnReport[] = [];

  // Chart options
  topSellingChartOptions: any;
  revenueChartOptions: any;
  returnChartOptions: any;
  bestSellingTimesOptions: any;
$index: any;

  constructor(private salesService: SalesReportService) {}

  ngOnInit(): void {
    this.getTopSellingProducts();
    this.getOrdersSummary();
    this.getRevenueReport();
    this.getCustomerInsights();
    this.getReturnReport();
    this.getBestSalesTimes();
  }

  getTopSellingProducts() {
    this.salesService.getTopSellingProducts(this.sellerId).subscribe((data: TopSellingProduct[]) => {
      this.topSellingProducts = data;
      this.topSellingChartOptions = {
        title: { text: 'Top Selling Products' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data.map(p => p.productName)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data.map(p => p.totalQuantity),
          type: 'bar',
          itemStyle: { color: '#4CAF50' }
        }]
      };
    });
  }

  getOrdersSummary() {
    this.salesService.getOrdersSummary(this.sellerId).subscribe((data: OrderSummary) => {
      this.ordersSummary = data;
    });
  }

  getRevenueReport() {
    this.salesService.getSellerProfits(this.sellerId).subscribe((data: ISellerProfit) => {
      this.revenueChartOptions = {
        title: {
          text: 'Revenue Breakdown',
          left: 'center'
        },
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              { value: data.weeklyProfit, name: 'Weekly Profit' },
              { value: data.monthlyProfit, name: 'Monthly Profit' },
              { value: data.halfYearProfit, name: 'Half-Year Profit' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    });
  }
  

  getCustomerInsights() {
    this.salesService.getCustomerInsights(this.sellerId).subscribe((data: CustomerInsights) => {
      this.customerInsights = data;
    });
  }

  getReturnReport() {
    this.salesService.getReturnReport(this.sellerId).subscribe((data: ReturnReport[]) => {
      console.log('Returnreport :',data)
      this.returnReport = data;
      this.returnChartOptions = {
        title: { text: 'Top Returned Products' },
        tooltip: {},
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: data.map(p => p.productName)
        },
        series: [{
          data: data.map(p => p.returnCount),
          type: 'bar',
          itemStyle: { color: '#FF9800' }
        }]
      };
    });
  }

  getBestSalesTimes() {
    this.salesService.getBestSalesTimes(this.sellerId).subscribe((data: BestSalesTime) => {
      console.log('best timing:', data);
  
      const dayLabels = data.bestDays.map(d => d.day);
      const dayValues = data.bestDays.map(d => d.totalOrders);
  
      this.bestSellingTimesOptions = {
        title: { text: 'Best Selling Days' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: dayLabels
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: dayValues,
          type: 'bar',
          itemStyle: { color: '#2196F3' }
        }]
      };
    });
  }
}
