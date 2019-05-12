import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  routerLinkGames = "/home/games";
  routerLinkRanktable = "/home/ranktable";
  routerLinkProfile = "/home/profile";

  ngOnInit() {
    this.router.navigate(['/home/games']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
