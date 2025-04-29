import { Component } from '@angular/core';
import { SellNavbarComponent } from '../sell-navbar/sell-navbar.component';
import { SellFooterComponent } from "../sell-footer/sell-footer.component";

@Component({
  selector: 'app-shipping-delivery',
  imports: [SellNavbarComponent, SellFooterComponent],
  templateUrl: './shipping-delivery.component.html',
  styleUrl: './shipping-delivery.component.css'
})
export class ShippingDeliveryComponent {

}
