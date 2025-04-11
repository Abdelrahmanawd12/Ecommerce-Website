import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../../Models/Iproduct';
import { ProductsService } from '../../../Services/Auth/Customer/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Icategory } from '../../../Models/Icategory';
import { CategoryService } from '../../../Services/Auth/Customer/category.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-shop',
  imports: [CommonModule,FormsModule],
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
        },
        error:(err)=>{
          console.log(err)
        }
      })

    })

  }

}
