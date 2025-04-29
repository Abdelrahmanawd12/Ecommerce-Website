// jumia-global-popup.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-jumia-global-popup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './jumia-global-bobup.component.html',
  styleUrls: ['./jumia-global-bobup.component.css']
})
export class JumiaGlobalPopupComponent {
  showPopup = false;
  selectedCountry = '';

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  proceed() {
    // Handle the proceed logic here
    console.log('Proceeding with country:', this.selectedCountry);
    this.closePopup();
  }
}