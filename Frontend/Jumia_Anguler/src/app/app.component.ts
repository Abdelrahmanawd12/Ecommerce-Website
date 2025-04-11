import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

import { HeaderComponent } from '../Components/header/header.component';
import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,HttpClientModule,CommonModule],
  providers: [],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Jumia_Anguler';
}
