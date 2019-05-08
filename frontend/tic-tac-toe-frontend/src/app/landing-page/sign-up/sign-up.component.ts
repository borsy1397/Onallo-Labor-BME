import { Component, OnInit } from '@angular/core';
import { SignUpService } from '../../services/sign-up/sign-up.service';
import { SignUpUser } from 'src/app/model/SignUpUser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  newUser: SignUpUser = {
    email: "",
    username: "",
    password: "",
    passwordRe: ""
  }

  errorMessage = "";
  correct = true;

  routerLinkLogin = "/login";

  constructor(
    private signUpService: SignUpService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    if(this.authService.checkAuth()){
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.signUpService.signUp(this.newUser).subscribe(res => {
      this.correct = true;
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/login']);
      }, 4000);
    }, err => {
      this.errorMessage = err.error.message;
      this.correct = false;
    });
  }

}
