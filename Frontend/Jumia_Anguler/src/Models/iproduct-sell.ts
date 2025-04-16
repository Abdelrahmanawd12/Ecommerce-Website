export interface IProductSell {
    productId: number; 
    name: string;
    description: string;
    price: number;
    quantity: number; 
    brand: string; 
    discount: number; 
    weight: number; 
    subCategoryId: number;
    subCategoryName?: string;
    sellerId: number; 
    ratingStars:number; 
  
    imageUrls?: File[]; 
  
    tags?: string[];
  }
  