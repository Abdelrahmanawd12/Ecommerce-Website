// import { Component } from '@angular/core';
// import { OrderService } from '../../Services/Auth/Customer/order.service';          //../services/order.service
// //import { OrderDto } from '../../Models/'; //../../Models/OrderDto

// @Component({
//   selector: 'app-order',
//   imports: [],
//   templateUrl: './order.component.html',
//   styleUrl: './order.component.css'
// })
// export class OrderComponent {
//   orders: any[] = [];

//   constructor(private orderService: OrderService) {}

//   ngOnInit(): void {
//     const customerId = 'user1'; // Replace with actual customer ID
//     const statusCategory = 'current'; // or 'past'

//     this.orderService.getOrdersByCustomerAndStatus(customerId, statusCategory)
//       .subscribe({
//         next: (data) => this.orders = data,
//         error: (err) => console.error('Error fetching orders', err)
//       });
//   }
// }





// src/app/order/order.component.ts
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { OrderService } from '../../Services/Auth/Customer/order.service';
// import { CommonModule } from '@angular/common';
// import { OrderDetailsDto } from '../../Models/order.model';

// @Component({
//   selector: 'app-order',
//   //standalone: true,  // Ensure this line is here since it's a standalone component
//   imports: [CommonModule], // <- this is necessary
//   templateUrl: './order.component.html',
//   styleUrls: ['./order.component.css'],
  
// })
// export class OrderComponent implements OnInit {
//   order: any;

//   constructor(
//     private route: ActivatedRoute,
//     private orderService: OrderService
//   ) {}

//   ngOnInit(): void {
//     const orderId = Number(this.route.snapshot.paramMap.get('id'));
//     //console.log('Order ID from route:', orderId); // Check this prints correctly


//     this.orderService.getOrderDetails(orderId).subscribe({
//       next: (data) => {
//         //console.log('Order received:', data); // Check if it prints a full order object
//         this.order = data},
//       error: (err) => console.error('Error fetching order details', err)
//     });
//   }
// }



// app/components/order/order.component.ts

import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/Auth/Customer/order.service';
import { OrderDetailsDto } from '../../Models/order.model';
import { OrderListDto } from '../../Models/order.model';  // Adjust path if needed
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,  // Ensure this line is here since it's a standalone component
  imports: [CommonModule], // <- this is necessary
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
  order: OrderDetailsDto | null = null;
  orders: OrderListDto[] = [];
  orderId = 1; // Replace this with dynamic value later if needed
  cancellationMessage: string ='';
  selectedOrder: OrderDetailsDto | null = null;

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadOrderDetails();
    this.loadOrdersByCategory();
    // Check if 'id' exists in the route and convert it to a number
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderId = +id;  // Convert string to number
    } else {
      console.error('Order ID not found in the URL.');
    }
  }

  loadOrderDetails(): void {
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (data) => this.order = data,
      error: (err) => console.error('Failed to fetch order details:', err)
    });
  }

  showOrderDetails(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (data) => {
        this.selectedOrder = data;
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        alert('Failed to load order details.');
      }
    });
  }
  hideOrderDetails(): void {
    this.selectedOrder = null;
  }
  

  loadOrdersByCategory() {
    const customerId = 'user1'; // You might get this from AuthService or route param
    const category = 'current'; // or 'past'
  
    this.orderService.getOrdersByStatusCategory(customerId, category)
      .subscribe({
        next: (data) => this.orders = data,
        error: (err) => console.error('Failed to load orders:', err)
      });
  }

  // Cancel order function
  cancelOrder(): void {
    this.orderService.cancelOrder(this.orderId).subscribe(
      (response) => {
        this.cancellationMessage = response.message;  // Update message on successful cancellation
        alert(this.cancellationMessage);  // Show the success message
      },
      (error) => {
        alert('An error occurred while canceling the order.');
        console.error(error);
      }
    );
  }
}

  
