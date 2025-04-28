import { ShippingDetails } from "./shipping-details";

export interface OrderDetails {
    orderId: number;
    customerName: string;
    items: Array<any>; 
    shippingDetails?: ShippingDetails; 
}
