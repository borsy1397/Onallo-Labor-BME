import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {


  routerLinkLogin = "/login";
  routerLinkSignUp = "/signup";

  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.checkAuth()) {
      this.router.navigate(['/home']);
    }
  }

  hiddenButtons() {
    if (!this.submitted) {
      this.submitted = true;
    }
  }
}
