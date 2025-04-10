import { Component } from '@angular/core';

import { HeaderComponent } from '../Components/header/header.component';
import { ShopComponent } from '../Components/Cstomer/shop/shop.component';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent],
  providers: [],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Jumia_Anguler';
}
