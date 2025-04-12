import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../Models/Iproduct';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../Services/Customer/products.service';

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
