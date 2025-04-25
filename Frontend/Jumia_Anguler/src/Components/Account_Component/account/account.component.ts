import { Component } from '@angular/core';
import { AccountSidebarComponent } from "../account-sidebar/account-sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [AccountSidebarComponent, CommonModule,RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

}
