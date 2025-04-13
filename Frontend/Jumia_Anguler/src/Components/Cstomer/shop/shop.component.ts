import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../Services/Customer/category.service';
import { Icategory, IProduct } from '../../../Models/Category';


@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  category!:Icategory;
  currentId:number=0;
  productsList:IProduct[]=[]as IProduct[];
  constructor(
    private _CategoryService:CategoryService,
    private activerouter:ActivatedRoute,
    private router:Router
  ) {}
  ngOnInit(): void {

    this.activerouter.paramMap.subscribe((paramMap)=>{
      this.currentId=Number(paramMap.get('id'))
      this._CategoryService.getCategoryById(this.currentId).subscribe({
        next:(data)=>{
          this.category=data
          console.log(this.category)
        },
        error:(err)=>{
          console.log(err)
        }
      })

    })

  }
  goToProductDetails(productId: number): void {
    console.log("hi")
    this.router.navigate(['/details', productId]);
  }

}
