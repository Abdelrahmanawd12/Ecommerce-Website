import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../Services/Customer/category.service';
import { Icategory, IProduct, Isubcategory } from '../../../Models/Category';
import { CartDTO } from '../../../Models/cart';
import { CartService } from '../../../Services/Customer/cart.service';
import { SubcategoryService } from '../../../Services/Customer/subcategory.service';
declare var bootstrap: any;


@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  category!:Icategory;
  subcategory!:Isubcategory;
  currentId:number=0;
  selectedSubCatId: number | null = null;
  brands: string[] = [];

  selectedBrands: string[] = [];
filteredProducts: IProduct[] = [];

//toast mess
toastMessage = '';
toastClass: string = 'bg-success';

  productsList:IProduct[]=[]as IProduct[];
   selectedQuantity: number = 1;
    cartData: CartDTO = {
      cartId: 0,
      customerName: '',
      items: []
    };

// pagination
currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;
  displayedSubcategories: Isubcategory[] = [];


  constructor(
    private _CategoryService:CategoryService,
    private activerouter:ActivatedRoute,
    private router:Router,
    private _CartServices:CartService,
    private _SubCategoryService:SubcategoryService
  ) {}
  //get user
  get user(): string {
    return localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {

    this.activerouter.paramMap.subscribe((paramMap)=>{
      this.currentId=Number(paramMap.get('id'))
      this._CategoryService.getCategoryById(this.currentId).subscribe({
        next:(data)=>{
          this.category=data
          console.log(this.category)
          this.getBrandsOfCategory(this.category)
          this.productsList = this.category.subcategory.flatMap(sub => sub.products);
              // Initialize pagination data
              this.totalPages = Math.ceil(this.category.subcategory.length / this.pageSize);
              this.loadPage(this.currentPage);
        },
        error:(err)=>{
          console.log(err)
        }
      })

    })

  }
  //go to Product Details
  goToProductDetails(productId: number): void {
    console.log("hi")
    this.router.navigate(['/details', productId]);
  }
  // pagination
  loadPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedSubcategories = this.category.subcategory.slice(startIndex, endIndex);
  }
  

//toast mess
showToast(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastClass = type === 'success' ? 'bg-success' : 'bg-danger';

  const toastEl = document.getElementById('cartToast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    console.error('Toast element not found');
  }
}
//add to cart

  addToCart(product: IProduct): void {
    const userId = localStorage.getItem('userId');

    if (!userId || userId.trim() === '') {
      this.router.navigateByUrl("/login");
      return;
    }
    this._CartServices.addItemToCart(product, this.selectedQuantity).subscribe({
      next: (res) => {
        console.log("Product added to cart", res);
        this.showToast("Product added to cart successfully!", 'success');
      },
      error: (err) => {
        console.log("error", err);
        const errorMsg = err?.error?.message || "Something went wrong!";
        this.showToast(errorMsg, 'error');
      }

    });
  }

  //get one subcategory by id
  getSubCategoryById(id:number):void{
    this._SubCategoryService.getSubcategoryById(id).subscribe({
      next:(data)=>{
        this.subcategory=data
        console.log(this.subcategory)
      },
      error:(err)=>{
        console.log(err)
      }
    })

  }
//get brands of the category
getBrandsOfCategory(category:Icategory):void{
category.subcategory.forEach((subcat)=>{
  subcat.products.forEach((product)=>{
    if(!this.brands.includes(product.brand)){
      this.brands.push(product.brand)
    }
  })
}

)}
// check if user choose checkbox
onBrandCheckboxChange(event: Event, brand: string): void {
  const isChecked = (event.target as HTMLInputElement).checked;

  if (isChecked) {
    this.selectedBrands.push(brand);
  } else {
    this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
  }

  this.filterProductsByBrands();
}

filterProductsByBrands(): void {
  if (this.selectedBrands.length === 0) {
    this.filteredProducts = this.productsList;
  } else {
    this.filteredProducts = this.productsList.filter(product =>
      this.selectedBrands.includes(product.brand)
    );
  }
}

}
