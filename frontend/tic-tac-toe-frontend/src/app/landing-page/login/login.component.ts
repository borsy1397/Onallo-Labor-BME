import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { LoginUser } from 'src/app/model/LoginUser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: LoginUser = {
    username: "",
    password: ""
  };

  routerLinkSignUp = "/signup";
  errorMessage = "";
  correct = true;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (this.authService.checkAuth()) {
      this.router.navigate(['/home/games']);
    }
  }

  onSubmit() {
    this.loginService.login(this.user).subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('username', res.user.username)

      this.loginService.setCurrentUser(res.user);

      this.correct = true;
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/home/games']);
      }, 2500);
    }, err => {
      this.correct = false;
      this.errorMessage = err.error.message;
    });
  }

}
