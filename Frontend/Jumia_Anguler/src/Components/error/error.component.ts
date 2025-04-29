import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(private route:Router) { }

  Back(){
    this.route.navigateByUrl('/home');
  }

  // ngOnInit() {
  //   document.querySelector('app-header')?.classList.add('d-none');
  //   document.querySelector('app-footer')?.classList.add('d-none');
  // }

  // ngOnDestroy() {
  //   document.querySelector('app-header')?.classList.remove('d-none');
  //   document.querySelector('app-footer')?.classList.remove('d-none');
  // }
}
