import { Injectable } from '@angular/core';
import { environment } from '../../Environment/Environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { IOrder } from '../../Models/iorder';
import { formatDate } from '@angular/common';
import { IProductSales } from '../../Models/iproduct-sales';
import { IProduct, Isubcategory, Icategory } from '../../Models/Category';
import { IProductSell } from '../../Models/iproduct-sell';
import { Categories } from '../../Models/categories';
import { SubCategories } from '../../Models/sub-categories';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = environment.apiSellUrl;
  readonly sellerId = localStorage.getItem('userId');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getAllProducts(sellerId: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.baseUrl}/products?sellerId=${sellerId}`).pipe(
      catchError(this.handleError<IProduct[]>('getAllProducts', []))
    );
  }
  
  

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/products/${id}`);
  }



  addProduct(product: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProduct`, product, {
      responseType: 'text' as 'json' 
    });
  }

  // updateProduct(productId: number, formData: FormData): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/updateProduct/${productId}`, formData, {
  //   });
  // }
  updateProduct(productId: number, formData: FormData): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.baseUrl}/updateProduct/${productId}`, formData).pipe(
      catchError(this.handleError<IProduct>('updateProduct'))
    );
  }
  // updateProduct(productId: number, product: IProduct): Observable<any> {
  //   const formData = new FormData();
  //     formData.append('Name', product.name);
  //   formData.append('Description', product.description);
  //   formData.append('Price', product.price.toString());
  //   formData.append('Quantity', product.quantity.toString());
  //   formData.append('Brand', product.brand);
  //   formData.append('Discount', product.discount.toString());
  //   formData.append('Weight', product.weight.toString());
  //   if (product.subCategoryName) {
  //     formData.append('SubCategoryName', product.subCategoryName.toString());
  //   }
  //   formData.append('SellerId', this.sellerId ? this.sellerId.toString() : '');
  
  //   if (product.imageUrls && product.imageUrls.length > 0) {
  //     for (let image of product.imageUrls) {
  //       formData.append('ImageUrls', image);
  //     }
  //   }
  
  //   if (product.tags && product.tags.length > 0) {
  //     for (let tag of product.tags) {
  //       formData.append('Tags', tag);
  //     }
  //   }
  
  //   return this.http.put(`${this.baseUrl}/updateProduct/${product.productId}`, formData);
  // }
  
  deleteProduct(productId: number, sellerId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${productId}?SellerId=${sellerId}`).pipe(
      catchError(this.handleError<any>('deleteProduct'))
    );
  }
  

  
  getAllSubcategories():Observable<Isubcategory>{
    return this.http.get<Isubcategory>(`${this.baseUrl}/getAllSubcategories`)
  }

  getSubcategoriesByCatName(catName: string): Observable<Isubcategory> {
    return this.http.get<any>(`${this.baseUrl}/subcategories`, { params: { catName } });
  }

  getCategories(): Observable<Icategory> {
    return this.http.get<any>(`${this.baseUrl}/getallCategories`);
  }

  getAllOrders(id: string): Observable<IOrder[]> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  getOrderByDate(id: string, startDate: Date, endDate: Date): Observable<IOrder[]> {
    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

    return this.http.get<IOrder[]>(`${this.baseUrl}/ordersByDate/${id}`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }
    });
  }

  getOrderByStatus(id: string, status: string): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${this.baseUrl}/ordersByStatus/${id}`, { params: { status } });
  }

  getOrderByDate2(id: string, date: Date): Observable<IOrder> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');

    return this.http.get<IOrder>(`${this.baseUrl}/ordersByDate`, {
      params: {
        id: id.toString(),
        date: formattedDate
      }
    });
  }

  getOrderById(sellerId: string, orderId: number): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseUrl}/orderById/${sellerId}`, {
      params: { orderId: orderId.toString() }
    });
  }
  

  UpdateOrderStatus(sellerId: string, orderId: number, status: string): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.baseUrl}/updateStatus`, { status, orderId, sellerId });
  }  

  deleteOrder(orderId: number, sellerId: string): Observable<IOrder> {
    return this.http.delete<IOrder>(`${this.baseUrl}/deleteOrder`, {
       params: {
         orderId, 
         sellerId
         } 
        });
  }





  // Basic search method
  getProductByName(name: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/products?name=${name}`).pipe(
      catchError(this.handleError<IProduct>('getProductByName'))
    );
  }

  // Enhanced search with suggestions
  searchProducts(term: string): Observable<IProduct[]> {
    if (term.length < 2) {
      return of([]); // Don't search for very short terms
    }
    return this.http.get<IProduct[]>(`${this.baseUrl}/products/search?q=${term}`).pipe(
      catchError(this.handleError<IProduct[]>('searchProducts', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getProductSales():Observable<IProductSales[]>{
    return this.http.get<IProductSales[]>(`${this.baseUrl}/productSales`);
  }

  //Categories
  getAllCategories(): Observable<Categories[]> {
    return this.http.get<Categories[]>(`${this.baseUrl}/allcat`);
  }

  getSubCategoriesByCategoryId(categoryId: number): Observable<SubCategories[]> {
    return this.http.get<SubCategories[]>(`${this.baseUrl}/allsubcat?categoryId=${categoryId}`);
  }
}

