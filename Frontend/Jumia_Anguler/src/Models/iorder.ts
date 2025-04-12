export interface IOrder {
    orderId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
    orderDate: Date;
    status: string;
    shippingAddress: string;
    shippingDate: Date;
    deliveryStatus: string;
    shippingInfo:{
        shippingMethod: string;
        shippingAddress: string;
        shippingDate: Date;
        deliveryDate: Date;
        trackingNumber: string;
        shippingStatus: string;
        recieverName: string;
        recieverPhone: string;
        recieverEmail: string;
    }
    orderItems: [
        {
            productName: string;
            productBrand: string;
            quantity: number;
            price: number;
            SubTotalPrice: number;
            productImage: [];
        }
    ];
    paymentInfo: {
        paymentMethod: string;
        paymentStatus: string;
        transactionId: string;
        transactionDate: Date;
        amount: number;
    }

}
