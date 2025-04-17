import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { IOrder } from '../../../Models/iorder';
import { SellerService } from '../../../Services/SellerServ/seller.service';
import { RouterEvent, RouterLink, RouterModule } from '@angular/router';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as bootstrap from 'bootstrap';
import { environment } from '../../../Environment/Environment.prod';


@Component({
  selector: 'app-order-dashboard',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './order-dashboard.component.html',
  styleUrl: './order-dashboard.component.css',
  animations: [
    // Fade in animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),

    // Slide in animation
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    // Hover animations
    trigger('optionHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.02)' })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ]),

    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.03)' })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class OrderDashboardComponent implements OnInit {

  sellerId = localStorage.getItem('userId');

  orders: IOrder[] = [];
  activeFilter = 'all';
  startDate: string = '';
  endDate: string = '';
  activeDateField: string | null = null;
  today!: string;
  noOrdersMessage: string | null = null;
  orderId: number | null = null;
  toastElement: any;
  showDeletePopup: boolean = false;
  selectedOrder: any = null;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  status: string = '';
  showModal = false;


  filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'ready', label: 'Ready to Ship' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'failed', label: 'Delivery Failed' },
    { value: 'returned', label: 'Returned' }
  ];
  showUpdateStatusModal: boolean = false;
  selectedStatus: string = '';
  statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'ready', label: 'Ready to Ship' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'failed', label: 'Delivery Failed' },
    { value: 'returned', label: 'Returned' }
  ];
  search: any;
  readonly imageBaseUrl = environment.imageBaseUrl;
  constructor(private orderService: SellerService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    this.fetchOrders();
  }

  fetchOrders() {
    if (this.sellerId) {
      this.orderService.getAllOrders(this.sellerId).subscribe((orders) => {
        this.orders = orders;
      });
    }
  }

  clearFilters() {
    this.fetchOrders();
    this.startDate = 'dd/MM/yyyy';
    this.endDate = 'dd/MM/yyyy';
    this.search = null;
  }


  filterByDate() {
    if (this.startDate && this.endDate && this.sellerId) {
      this.orderService.getOrderByDate(this.sellerId, new Date(this.startDate), new Date(this.endDate))
        .subscribe((orders) => {
          this.orders = orders;
        }, (error) => {
          this.orders = [];
        });
    } else {
      this.orders = [];
    }
  }

  filterByStatus() {
    if (!this.sellerId) return;

    if (this.activeFilter === 'all') {
      this.fetchOrders();
      this.noOrdersMessage = null;
    } else {
      this.orderService.getOrderByStatus(this.sellerId, this.activeFilter)
        .subscribe({
          next: (orders) => {
            this.orders = orders;
          },
          error: () => {
            this.orders = [];
          }
        });
    }
  }

  SearchById(event?: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (event && keyboardEvent.key !== 'Enter') {
      return;
    }

    if (this.orderId && this.sellerId) {
      this.orderService.getOrderById(this.sellerId, Number(this.orderId)).subscribe({
        next: (order) => {
          console.log('Fetched order:', order);
          this.orders = order ? [order] : [];
          this.noOrdersMessage = order ? null : "No orders found with this ID.";
        },
        error: (error) => {
          this.orders = [];
          this.noOrdersMessage = "No orders found with this ID.";
          console.error('Error fetching order:', error);
        }
      });
    } else {
      this.fetchOrders();
      this.noOrdersMessage = null;
    }
  }

  deleteOrder(order: any) {
    this.selectedOrder = order;
    this.showDeletePopup = true;
  }


  openModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  confirmDelete() {
    if (!this.selectedOrder || !this.sellerId) return;

    this.orderService.deleteOrder(this.selectedOrder.orderId, this.sellerId)
      .subscribe({
        next: (response) => {
          this.orders = this.orders.filter(o => o.orderId !== this.selectedOrder.orderId);

          this.showDeletePopup = false;

          this.showToastMessage(`Order #${this.selectedOrder.orderId} deleted successfully`, 'success');
        },
        error: (error) => {
          this.showToastMessage('Failed to delete order', 'error');
          console.error('Delete error:', error);
        }
      });
  }
  openUpdateStatusModal(order: any) {
    this.selectedOrder = order;
    this.selectedStatus = order.orderStatus;
    this.showUpdateStatusModal = true;
  }
  closeUpdateStatusModal() {
    this.showUpdateStatusModal = false;
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
  }

  confirmStatusUpdate() {
    if (this.sellerId && this.selectedOrder && this.selectedStatus) {
      this.orderService.UpdateOrderStatus(
        this.sellerId,
        this.selectedOrder.orderId,
        this.selectedStatus
      ).subscribe({
        next: (updatedOrder) => {
          this.orders = this.orders.map(order =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order,
            this.fetchOrders()
          );
          this.closeUpdateStatusModal();
          this.showToastMessage('Status updated successfully', 'success');
        },
        error: (error) => {
          this.showToastMessage('Failed to update status', 'error');
          console.error('Update error:', error);
        }
      });
    } else {
      console.error('Missing required values: sellerId, selectedOrder, or selectedStatus');
    }
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  hideToast() {
    this.showToast = false;
  }

  setActiveFilter(filterValue: string) {
    this.activeFilter = filterValue;
    this.filterByStatus();
  }
  openOrderModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
    console.log('showModal:', this.showModal);
    document.body.style.overflow = 'hidden';
  }

  onDateFocus(field: 'start' | 'end') {
    this.activeDateField = field;
  }

  onDateBlur() {
    setTimeout(() => {
      this.activeDateField = null;
    }, 200);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'ready': 'status-ready',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'canceled': 'status-canceled',
      'failed': 'status-failed',
      'returned': 'status-returned'
    };
    return statusMap[status.toLowerCase()] || '';
  }
}
