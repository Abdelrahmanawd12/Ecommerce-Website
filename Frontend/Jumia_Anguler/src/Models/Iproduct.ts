export interface IProduct {
  productId: number,
  name: string,
  description: string,
  price:number,
  categoryName: string,
  quantity: number,
  brand: string,
  ratingStars: number[],
  imageUrls: string[],
  tags:string[],
  discount: number,
  weight: number,
  status:string

}
