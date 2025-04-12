// export interface OrderItemSummary {
//     productId: number;
//     productName: string;
//     productImageUrl: string;
//     orderDate: string;
//     orderStatus: string;
//   }
  


  // export interface OrderItemDto {
  //   productName: string;
  //   productImageUrl: string;
  //   quantity: number;
  //   subTotal: number;
  // }
  
  // export interface OrderDetailsDto {
  //   orderId: number;
  //   orderDate: string;  // Adjust the type if necessary
  //   orderStatus: string;
  //   paymentMethod: string;
  //   paymentStatus: string;
  //   shippingAddress: string;
  //   totalAmount: number;
  //   orderTrackingNumber: string;
  //   items: OrderItemDto[];
  // }
  

  // Models/order.models.ts
//id 
export interface OrderDetailsDto {
  orderId: number;
  orderDate: string; // ISO string
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  totalAmount: number;
  orderTrackingNumber: number;
  customerName: string;
  shippingInfo: ShippingStatusDto;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  subTotal: number;
}

export interface ShippingStatusDto {
  trackingNumber: string;
  shippingStatus: string;
  estimatedDelivery: string | null;
}



//status.. category
export interface OrderItemSummaryDto {
  productId: number;
  productName: string;
  productImageUrl: string;
}

export interface OrderListDto {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  items: OrderItemSummaryDto[];
}
