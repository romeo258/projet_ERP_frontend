import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-newagency',
  templateUrl: './newagency.component.html',
  styleUrls: ['./newagency.component.css']
})
export class NewagencyComponent {

  showScrollButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollDistance = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollDistance > 100;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
