import { ICartitem } from "./icartitem";
import { IPayment } from "./ipayment";
import { IShipping } from "./ishipping";

export interface ICheckoutRequest {
    customerId: string;
    cartItems: ICartitem[];
    shipping: IShipping;
    payment: IPayment;
  
}
