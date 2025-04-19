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
  ],  templateUrl: './seller-sales.component.html',
  styleUrls: ['./seller-sales.component.css']
})
export class SellerSalesComponent implements OnInit {
  productSales: IProductSales[] = [];
  sellerProfits: ISellerProfit | null = null;

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
    ]
  };

  constructor(private sales: SalesReportService) {}

  ngOnInit(): void {
    this.getProductSales();
    this.getSellerProfits();
  }

  getProductSales() {
    this.sales.getProductSales().subscribe(data => {
      this.productSales = data;
      this.chartOptions.xAxis.data = data.map(d => d.ProductName);
      this.chartOptions.series[0].data = data.map(d => d.sales);
    });
  }

  getSellerProfits() {
    const sellerId = localStorage.getItem('userId')!;
    this.sales.getSellerProfits(sellerId).subscribe(data => {
      this.sellerProfits = data;
    });
  }

  

}