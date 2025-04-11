import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/Auth/Customer/category.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../Models/Iproduct';
import { ProductsService } from '../../Services/Auth/Customer/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  currentId:number=0;
  product!:IProduct;
  constructor(
    private activerouter:ActivatedRoute,
    private _productservice:ProductsService
  ) {}
  ngOnInit(): void {
    this.activerouter.paramMap.subscribe((paramMap)=>{
      this.currentId=Number(paramMap.get('id'))
      this._productservice.getProductById(this.currentId).subscribe({
        next:(data)=>{
          this.product=data
        },
        error:(err)=>{
          console.log(err)
        }
      })

    })

  }

}
