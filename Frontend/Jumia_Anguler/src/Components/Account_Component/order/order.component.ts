import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsDto, OrderListDto } from '../../../Models/order.model';
import { OrderService } from '../../../Services/Customer/order.service';
import { environment } from '../../../Environment/Environment.prod';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
  order: OrderDetailsDto | null = null;
  orders: OrderListDto[] = [];
  ongoingOrders: OrderListDto[] = [];
  canceledOrders: OrderListDto[] = [];

  selectedOrder: OrderDetailsDto | null = null;
  activeTab: string = 'ongoing'; // Default tab

  showThankYou = false;

  
  readonly imgbaseUrl=environment.imageBaseUrl;
  //customerId = 'user1';
  customerId: string = localStorage.getItem('userId') ?? '';


  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadOrdersByCategory();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const orderId = +id;
      this.loadOrderDetails(orderId);
    }

    const state = history.state as { showThankYou?: boolean };

  if (state?.showThankYou) {
    this.showThankYou = true;

    setTimeout(() => {
      this.showThankYou = false;
      // تحميل البيانات لو محتاج
    }, 3000);
  } else {
    this.showThankYou = false;
    // تحميل البيانات لو محتاج
  }
  }

  loadOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => this.order = data,
      error: (err) => console.error('Failed to fetch order details:', err)
    });
  }

  showOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => this.selectedOrder = data,
      error: (err) => {
        console.error('Failed to load order details:', err);
        alert('Failed to load order details.');
      }
    });
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }

  //loadOrdersByCategory(): void {
    //const customerId = 'user1';
    
  // loadOrdersByCategory(): void {
  //   const customerId = 'user1';
  //   const category = 'current';

  //   this.orderService.getOrdersByStatusCategory(customerId, category).subscribe({
  //     next: (data) => {
  //       this.orders = data;

  //       this.ongoingOrders = data.filter(order => {
  //         const status = order.orderStatus.trim().toLowerCase();
  //         return ['pending', 'shipped', 'delivered'].includes(status);
  //       }
  //       );

  //       this.canceledOrders = data.filter(order =>{
  //         const status = order.orderStatus.trim().toLowerCase();
  //         return status === 'canceled';
  //       }
  //       );
  //     },
  //     error: (err) => console.error('Failed to load orders:', err)
  //   });
  // }
  //readonly customerId = localStorage.getItem('userId') ||'';
  loadOrdersByCategory(): void {
    // const customerId = 'user1';
  
  
    // Get current (ongoing/delivered) orders
    this.orderService.getOrdersByStatusCategory(this.customerId, 'current').subscribe({
      next: (data) => {
        this.ongoingOrders = data; // already filtered by API
      },
      error: (err) => console.error('Failed to load ongoing orders:', err)
    });
  
    // Get past (cancelled/returned) orders
    this.orderService.getOrdersByStatusCategory(this.customerId, 'past').subscribe({
      next: (data) => {
        this.canceledOrders = data; // already filtered by API
      },
      error: (err) => console.error('Failed to load canceled orders:', err)
    });
  }
  
  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.loadOrdersByCategory(); // refresh the list
      },
      error: (error) => {
        console.error('Failed to cancel order', error);
      }
    });
  }
  confirmCancel(orderId: number) {
    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (confirmed) {
      this.cancelOrder(orderId);
    }
  }
  

  setTab(tab: string): void {
    this.activeTab = tab;
    this.selectedOrder = null;
  }
}
