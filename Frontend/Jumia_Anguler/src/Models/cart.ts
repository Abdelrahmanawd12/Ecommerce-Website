export interface AddToCartDTO {
  customerId: string;
  productId: number;
  quantity: number;
}
export interface CartItemDTO {
  productId: number;
  productName: string;
  productStock: number;
  discount: number;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface CartDTO {
  cartId: number;
  customerName: string;
  items: {
    productId: number;
    productName: string;
    productStock: number;
    discount: number;
   quantity: number;
    price: number;
    imageUrl: string;
  }[];
}


export interface CartSummaryDTO {
  customerName: string;
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
}
