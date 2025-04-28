import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsDto, OrderListDto } from '../../../Models/order.model';
import { OrderService } from '../../../Services/Customer/order.service';
import { environment } from '../../../Environment/Environment.prod';
import { CreateShipmentService } from '../../../Services/Shipment/create-shipment.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
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


  constructor(private orderService: OrderService, private route: ActivatedRoute ,
    private createShipmentService: CreateShipmentService, private cdr: ChangeDetectorRef) {}
    // ,private cdr: ChangeDetectorRef

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
    console.log('Loading orders for customer:', this.customerId);
  
    // Get current (ongoing/delivered) orders
    this.orderService.getOrdersByStatusCategory(this.customerId, 'current').subscribe({
      next: (data) => {
        this.ongoingOrders = data; // already filtered by API
      },
      // error: (err) => console.error('Failed to load ongoing orders:', err)
    });
  
    // Get past (cancelled/returned) orders 
    this.orderService.getOrdersByStatusCategory(this.customerId, 'past').subscribe({
      next: (data) => {
        this.canceledOrders = data; // already filtered by API
      },
      error: (err) => console.error('Failed to load canceled orders:', err)
    });
  }
  
  
  // confirmCancel(orderId: number) {
  //   const confirmed = confirm('Are you sure you want to cancel this order?');
  //   if (confirmed) {
  //     this.cancelOrder(orderId);
      
  //   }
  //  }
  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
      this.loadOrdersByCategory(); 
      console.log('Order canceled successfully        DONE');
      window.location.reload(); // إعادة تحميل الصفحة بعد إلغاء الطلب
      //this.cdr.detectChanges(); // إجبار Angular على تحديث العرض
      },
      error: (error) => {
        console.error('Failed to cancel order', error);
      }
    });
  }
  
  // confirmCancel(orderId: number): void {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you really want to cancel this order?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#3085d6',
  //     confirmButtonText: 'Yes, cancel it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // لما المستخدم يؤكد الكانسيل
  //       this.orderService.cancelOrder(orderId).subscribe({
  //         next: () => {
  //           Swal.fire(
  //             'Canceled!',
  //             'Your order has been canceled.',
  //             'success'
  //           );
  //           this.loadOrdersByCategory(); // تحدث القوائم بعد نجاح الإلغاء
  //         },
  //         error: (error) => {
  //           console.error('Failed to cancel order', error);
          
  //           // خد النص كما هو، بدون محاولة قراءة JSON
  //           const errorMessage = typeof error.error === 'string' ? error.error : 'Something went wrong.';
          
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Cannot cancel order',
  //             text: errorMessage,
  //           });
  //         }
          
  //       });
  //     }
  //   });
  // }
  
  confirmCancel(orderId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelOrder(orderId);
      }
    });
  }
  
  

  setTab(tab: string): void {
    this.activeTab = tab;
    this.selectedOrder = null;
  }

  //-------------------------------------------------------------------------
  //Shipment

  createShipmentForOrder(order: OrderDetailsDto): void {
    this.createShipmentService.createShipment(order).subscribe({
      next: (response) => {
        order['shippingDetails'] = response;
        console.log('Shipment created:', response);
      },
      error: (err) => {
        console.error('Failed to create shipment:', err);
        //alert('Failed to create shipment.');
      }
    });
  }
  
  
  showOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
        this.createShipmentForOrder(data); 
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        alert('Failed to load order details.');
      }
    });
  }
}
