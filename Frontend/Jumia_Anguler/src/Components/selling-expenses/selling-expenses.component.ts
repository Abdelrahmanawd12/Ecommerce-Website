import { Component } from '@angular/core';
import { SellFooterComponent } from "../sell-footer/sell-footer.component";
import { SellNavbarComponent } from "../sell-navbar/sell-navbar.component";

@Component({
  selector: 'app-selling-expenses',
  imports: [SellFooterComponent, SellNavbarComponent],
  templateUrl: './selling-expenses.component.html',
  styleUrl: './selling-expenses.component.css'
})
export class SellingExpensesComponent {

}
