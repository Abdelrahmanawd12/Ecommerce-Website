import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help-center',
  imports: [],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.css'
})
export class HelpCenterComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollTo(fragment);
      }
    });
  }

  activeItem: string = 'help-center'; 

  setActive(itemId: string): void {
    this.activeItem = itemId;
    this.scrollTo(itemId);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // scrollTo(section: string): void {
  //   const element = document.getElementById(section);
  //   if (element) {
  //     document.querySelectorAll('.sidebar-menu a').forEach(el => {
  //       el.classList.remove('active');
  //     });
      
  //     document.querySelector(`.sidebar-menu a[onclick*="${section}"]`)?.classList.add('active');
      
  //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
  //     element.classList.add('highlight');
  //     setTimeout(() => {
  //       element.classList.remove('highlight');
  //     }, 2000);
  //   }
  // }
}
