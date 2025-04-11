import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sell-navbar',
  imports: [RouterModule],
  templateUrl: './sell-navbar.component.html',
  styleUrl: './sell-navbar.component.css'
})
export class SellNavbarComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}
