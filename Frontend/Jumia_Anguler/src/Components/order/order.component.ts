
// app/components/order/order.component.ts

// import { Component, OnInit } from '@angular/core';

// import { OrderDetailsDto } from '../../Models/order.model';
// import { OrderListDto } from '../../Models/order.model';  // Adjust path if needed
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { OrderService } from '../../Services/Customer/order.service';

// @Component({


//   selector: 'app-order',
//   standalone: true,  // Ensure this line is here since it's a standalone component
//   imports: [CommonModule], // <- this is necessary
//   templateUrl: './order.component.html'
// })
// export class OrderComponent implements OnInit {

//   order: OrderDetailsDto | null = null;
//   orders: OrderListDto[] = [];
//   orderId = 1; // Replace this with dynamic value later if needed
//   cancellationMessage: string ='';
//   selectedOrder: OrderDetailsDto | null = null;

//   constructor(private orderService: OrderService, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.loadOrderDetails();
//     this.loadOrdersByCategory();
//     // Check if 'id' exists in the route and convert it to a number
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.orderId = +id;  // Convert string to number
//     } else {
//       console.error('Order ID not found in the URL.');
//     }
//   }

//   loadOrderDetails(): void {
//     this.orderService.getOrderDetails(this.orderId).subscribe({
//       next: (data) => this.order = data,
//       error: (err) => console.error('Failed to fetch order details:', err)
//     });
//   }

//   showOrderDetails(orderId: number): void {
//     this.orderService.getOrderDetails(orderId).subscribe({
//       next: (data) => {
//         this.selectedOrder = data;
//       },
//       error: (err) => {
//         console.error('Failed to load order details:', err);
//         alert('Failed to load order details.');
//       }
//     });
//   }
//   hideOrderDetails(): void {
//     this.selectedOrder = null;
//   }
  

//   loadOrdersByCategory() {
//     const customerId = 'user1'; // You might get this from AuthService or route param
//     const category = 'current'; // or 'past'
  
//     this.orderService.getOrdersByStatusCategory(customerId, category)
//       .subscribe({
//         next: (data) => this.orders = data,
//         error: (err) => console.error('Failed to load orders:', err)
//       });
//   }

//   // Cancel order function
//   cancelOrder(id: number) {
//     this.orderService.cancelOrder(id).subscribe({
//       next: (response) => {
//         console.log('Order cancelled', response);
//         // Optionally update UI or show a success message
//       },
//       error: (error) => {
//         console.error('Failed to cancel order', error);
//       }
//     });
//   }
// }  

  


// import { Component, OnInit } from '@angular/core';
// import { OrderDetailsDto, OrderListDto } from '../../Models/order.model';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { OrderService } from '../../Services/Customer/order.service';

// @Component({
//   selector: 'app-order',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order.component.html'
// })
// export class OrderComponent implements OnInit {
//   order: OrderDetailsDto | null = null;
//   orders: OrderListDto[] = [];
//   orderId = 1;
//   cancellationMessage: string = '';
//   selectedOrder: OrderDetailsDto | null = null;
//   selectedTab: 'current' | 'past' = 'current';
//   expandedOrderId: number | null = null;
//   canceledCount: number = 0;

//   constructor(private orderService: OrderService, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) this.orderId = +id;

//     this.loadOrdersByCategory('current');
//     this.countCanceledOrders();
//   }

//   loadOrderDetails(): void {
//     this.orderService.getOrderDetails(this.orderId).subscribe({
//       next: (data) => this.order = data,
//       error: (err) => console.error('Failed to fetch order details:', err)
//     });
//   }

//   showOrderDetails(orderId: number): void {
//     this.orderService.getOrderDetails(orderId).subscribe({
//       next: (data) => this.selectedOrder = data,
//       error: (err) => {
//         console.error('Failed to load order details:', err);
//         alert('Failed to load order details.');
//       }
//     });
//   }

//   hideOrderDetails(): void {
//     this.selectedOrder = null;
//   }

//   loadOrdersByCategory(category: 'current' | 'past') {
//     this.selectedTab = category;
//     const customerId = 'user1';
//     this.orderService.getOrdersByStatusCategory(customerId, category).subscribe({
//       next: (data) => this.orders = data,
//       error: (err) => console.error('Failed to load orders:', err)
//     });
//   }

//   countCanceledOrders(): void {
//     const customerId = 'user1';
//     this.orderService.getOrdersByStatusCategory(customerId, 'past').subscribe({
//       next: (data) => this.canceledCount = data.length,
//       error: (err) => console.error('Failed to count canceled orders:', err)
//     });
//   }

//   toggleDetails(orderId: number): void {
//     if (this.expandedOrderId === orderId) {
//       this.expandedOrderId = null;
//       this.selectedOrder = null;
//     } else {
//       this.expandedOrderId = orderId;
//       this.showOrderDetails(orderId);
//     }
//   }

//   cancelOrder(id: number) {
//     this.orderService.cancelOrder(id).subscribe({
//       next: (response) => {
//         console.log('Order cancelled', response);
//         this.loadOrdersByCategory(this.selectedTab);
//         this.countCanceledOrders();
//       },
//       error: (error) => console.error('Failed to cancel order', error)
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { OrderDetailsDto, OrderListDto } from '../../Models/order.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../Services/Customer/order.service';

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

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadOrdersByCategory();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const orderId = +id;
      this.loadOrderDetails(orderId);
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
  loadOrdersByCategory(): void {
    const customerId = 'user1';
  
    // Get current (ongoing/delivered) orders
    this.orderService.getOrdersByStatusCategory(customerId, 'current').subscribe({
      next: (data) => {
        this.ongoingOrders = data; // already filtered by API
      },
      error: (err) => console.error('Failed to load ongoing orders:', err)
    });
  
    // Get past (cancelled/returned) orders
    this.orderService.getOrdersByStatusCategory(customerId, 'past').subscribe({
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
