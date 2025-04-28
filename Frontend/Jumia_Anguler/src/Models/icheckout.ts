export interface Icheckout {
    customerId: string;
    sellerId: string;
    paymentMethod: string;
    shippingAddress: string;
    items: {
      productId: number;
      productName: string;
      productImageUrl: string;
      quantity: number;
      subTotal: number;
    }[];
    cartItems: {
      productId: number;
      sellerId: string;
      quantity: number;
      unitPrice: number;
    }[];
    shipping: {
      shippingId?: number;
      orderId?: number;
      shippingMethod: string;
      shippingAddress: string;
      shippingDate?: string; 
      deliveryDate: string;
      trackingNumber?: string;
      shippingStatus: string;
      receiverName: string;
      receiverPhone: string;
      receiverEmail: string;
    };
    payment: {
      paymentId?: number;
      paymentMethod: string;
      amount: number;
      paymentDate?: string; 
      status: string;
      transactionId?: string;
      orderId?: number;
    };
    orderItems: Array<{
      productName: string;
      brand: string;
      quantity: number;
      price: number;
      SubTotalPrice: number;
      imageUrls: string[];
    }>;

}
