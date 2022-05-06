import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  userName: String;
  isAuthenticated: Observable<boolean>;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAuthenticated.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userName = this.authService.getCurrentCredentials().userName;
      }
    });
  }

  logout() {
    this.authService.cleanTokenStored();
  }
}
