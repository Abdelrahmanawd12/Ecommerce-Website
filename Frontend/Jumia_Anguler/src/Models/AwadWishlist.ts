import { IProduct } from "./Category";

export interface AwadWishlistDTO {
 wishlistId: number,
  customerName: string,

  wishlistItems: AwadWishlistItemDTO[]

}
export interface AddToWishlistDTO {
  customerId: string;
  productId: number;
}
export interface AwadWishlistItemDTO {
  wishlistItemId: number,
      wishlistId: number,
      products:IProduct[]

}
