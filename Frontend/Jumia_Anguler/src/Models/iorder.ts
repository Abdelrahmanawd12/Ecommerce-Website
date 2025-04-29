export interface IOrder {
    sellerId?:string;
    customerId?:string;
    cartItems?:[];
    orderId?: number;
    productId?: number;
    quantity: number;
    totalAmount: number;
    orderDate: Date;
    orderStatus: string;
    shippingAddress: string;
    shippingDate: Date;
    deliveryStatus: string;
    shippingInfo: {
        shippingMethod: string;
        shippingAddress: string;
        shippingDate: Date;
        deliveryDate: Date;
        trackingNumber: number;
        shippingStatus: string;
        receiverName: string;
        recieverPhone: string;
        recieverEmail: string;
    }
    orderItems: [
        {
            productName: string;
            brand: string;
            quantity: number;
            price: number;
            SubTotalPrice: number;
            imageUrls?: string[]
        }
    ];
    payment: {
        paymentMethod: string;
        status: string;
        transactionId: string;
        transactionDate: Date;
        amount: number;
    }

}
