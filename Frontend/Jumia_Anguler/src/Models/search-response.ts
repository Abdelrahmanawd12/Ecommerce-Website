export interface SearchResponse {
    productId: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    quantity: number;
    weight: number;
    brand: string;
    subCategoryName: string;
    imageUrls: string[];
    tags: string[];
    ratingStars: number[];
}
