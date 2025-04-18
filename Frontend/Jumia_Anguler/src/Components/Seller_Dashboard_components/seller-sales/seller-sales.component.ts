import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SellerService } from '../../../Services/SellerServ/seller.service';
import { IProductSales } from '../../../Models/iproduct-sales';
import { ISellerProfit } from '../../../Models/iseller-profit';
import { SalesReportService } from '../../../Services/SellerServ/sales-reports.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-sales-dashboard',
  imports: [
    CurrencyPipe,
    NgxEchartsModule,
    CommonModule
  ], templateUrl: './seller-sales.component.html',
  styleUrls: ['./seller-sales.component.css']
})
export class SellerSalesComponent implements OnInit {
  productSales: IProductSales[] = [];
  sellerProfits: ISellerProfit | null = null;
  averageOrderValue: number = 0;
  salesOverTimeChartOptions: any;
  lowStockProducts: any[] = [];


  chartOptions: any = {
    title: {
      text: 'Product Sales',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar'
      }
    ],
   
  };

  constructor(private sales: SalesReportService) { }

  ngOnInit(): void {
    this.getProductSales();
    this.getSellerProfits();
    this.getAverageOrderValue();
    this.getSalesOverTime();
    this.getLowStockProducts();
  }
  getProductSales() {
    this.sales.getProductSales().subscribe(data => {
      console.log('Product Sales Data:', data);
      this.productSales = data;
      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          ...this.chartOptions.xAxis,
          data: this.productSales.map(item => item.productName)
        },
        series: [
          {
            ...this.chartOptions.series[0],
            data: this.productSales.map(item => item.sales)
          }
        ]
      };
    });
  }

  getOrangeGradientForValue(value: number, maxValue: number): any {
    const intensity = 0.3 + (0.7 * (value / maxValue));
    
    // Orange color values (RGB: 255, 165, 0)
    return {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: `rgba(255, ${165 * intensity}, 0, ${intensity})` // Top of bar
      }, {
        offset: 1,
        color: `rgba(255, ${165 * intensity * 0.7}, 0, ${intensity * 0.9})` // Bottom of bar
      }]
    };
  }
  

  getSellerProfits() {
    const sellerId = localStorage.getItem('userId')!;
    this.sales.getSellerProfits(sellerId).subscribe(data => {
      console.log('Seller Profit Data :', data)
      this.sellerProfits = data;
    });
  }


  getAverageOrderValue() {
    const sellerId = localStorage.getItem('userId')!;
    this.sales.getAvgOrderValue(sellerId).subscribe(response => {
      console.log('Product avg value Data:', response);
      this.averageOrderValue = response; 
    });
  }
  

  getSalesOverTime() {
    const sellerId = localStorage.getItem('userId')!;
    this.sales.getSalesOverTime(sellerId).subscribe(data => {
      console.log('Sales over time Data:', data);
      this.salesOverTimeChartOptions = {
        xAxis: {
          type: 'category',
          data: data.map((d: any) => d.date.split('T')[0])
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.map((d: any) => d.totalSales),
            type: 'line',
            smooth: true
          }
        ]
      };
    });
  }

  getLowStockProducts() {
    const sellerId = localStorage.getItem('userId')!;
    this.sales.getLowStock(sellerId).subscribe(data => {
      console.log('low stock product:', data);
      this.lowStockProducts = data;
    });
  }


}