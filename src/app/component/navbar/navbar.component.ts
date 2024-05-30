import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface/user';
import { SearchService } from 'src/app/service/search.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() user: User;

  constructor(private router: Router, private userService: UserService, private searchService: SearchService) {}

  onSearch(term: string) {
    this.searchService.search(term);
  }
  logOut(): void {
    this.userService.logOut();
    this.router.navigate(['/login']);
  }

}
