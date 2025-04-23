// export interface AddressBook {
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
//     street: string;
//     city: string;
//     country: string;
//   }
  

//   export interface CartProduct {
//     productId: number;
//     productName: string;
//     imageUrl: string;
//     quantity: number;
//     price: number;
//     // subTotal: number;
//   }
  
  
  
//   //cart
//   export interface AddToCartDTO {
//     customerId: string;
//     productId: number;
//     quantity: number;
//   }
//   export interface CartItemDTO {
//     productId: number;
//     productName: string;
//     productStock: number;
//     discount: number;
//     quantity: number;
//     price: number;
//     imageUrl: string;
//   }
  
//   export interface CartDTO {
//     cartId: number;
//     customerName: string;
//     items: {
//       productId: number;
//       productName: string;
//       productStock: number;
//       discount: number;
//      quantity: number;
//       price: number;
//       imageUrl: string;
//     }[];
//   }
  
  
//   export interface CartSummary {
//     customerName: string;
//     totalItems: number;
//     totalPrice: number;
//     totalDiscount: number;
//   }
  
export interface Address {
  street: string;
  city: string;
  country: string;
  userId: string;
}


export interface CheckoutProduct {
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  price: number;
  discount: number;
  totalPrice: number;
}

export interface CartSummary {
  products: CheckoutProduct[];
  grandTotal: number;
}



export interface Checkout {
  customerId: string;
  shippingAddress: string;
}



export interface AddressBook {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  street: string;
  city: string;
  country: string;
}