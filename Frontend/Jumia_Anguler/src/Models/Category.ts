export interface IProduct {
id: any;
  productId: number,
  name: string,
  description: string,
  price:number,
  subCategoryName: string,
  quantity: number,
  brand: string,
  ratingStars: number[],
  imageUrls: string[],
  tags:string[],
  discount: number,
  weight: number,
  status:string

}
export interface Isubcategory {
subCatId: number,
subCatName: string,
categoryName: string,
products: IProduct[];
}

export  interface Icategory {
    id: number,
    name: string,
    subcategory: Isubcategory[]
}

