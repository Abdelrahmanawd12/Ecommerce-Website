import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
  counter: number = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const interval = setInterval(() => {
      this.counter--;
      if (this.counter === 0) {
        clearInterval(interval);
        this.router.navigate(['/']);
      }
    }, 1000);
    
  }
}
