import { Component, OnInit } from '@angular/core';
import { SidebarNavbarService } from 'src/app/service/sidebar-navbar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private sidebarNavbarService: SidebarNavbarService){}

  ngOnInit(): void {
    this.sidebarNavbarService.initSidebarToggle();
  }

  openMail() {
    const email = 'springtech258@gmail.com';
    const mailtoLink = `mailto:${email}`;
    window.open(mailtoLink, '_blank');
  }
  
}
