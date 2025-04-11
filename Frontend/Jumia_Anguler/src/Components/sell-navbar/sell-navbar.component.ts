import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sell-navbar',
  imports: [],
  templateUrl: './sell-navbar.component.html',
  styleUrl: './sell-navbar.component.css'
})
export class SellNavbarComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollTo(sectionId: string): void {
    this.viewportScroller.scrollToAnchor(sectionId);
  }
}
