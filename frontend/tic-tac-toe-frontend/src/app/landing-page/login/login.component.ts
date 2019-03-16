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
  }

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
      this.router.navigate(['/home']); // Ez itt legyen, vagy a konstruktorba irjam?
    }
  }

  onSubmit() {
    this.loginService.login(this.user).subscribe(res => {
      // Ha sikerult a bejelentkezes, akkor a ketto tokent el kell tarolni --talan megoldva

      // HEADERBE BERAKNI A TOKENEKET KERESNEL -- talan megoldva

      // Ha mar be van jelentkezve a felhasznalo, akkor nem szabad, hogy megegyszer bejelentkezhessen
      // Ezt valahol kezelni kell majd
      // Illetve regisztralni sem szabad, szoval ott is ellenorizni   ----- ez talan megoldva

      // Token interceptor????? --- talan megoldva


      /*import { HttpHeaders } from '@angular/common/http';

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json', ---- van interceptor, szoval ez nem kell
          'Authorization': 'my-auth-token'
        })
      };*/


      // Ez jo cuccnak nez ki, lehet ezt kene hasznalni, mint minden komponensnel az authservices checkAuth-ot
      // Ez nem arra van, de csak egy else agat kell belerakni
      // @Injectable()
      // export class IsLoggedIn {
      //   constructor(
      //     private router: Router,
      //     private authService: AuthService) {
      //   }

      //   resolve(): void {
      //     if (this.authService.isAuthenticated) this.router.navigate(['/dashboard'])
      //   }
      // }

      // {
      //   path: 'login',
      //   component: LoginComponent,
      //   resolve: [IsLoggedIn]
      // }

      //  A localstorageba itt kene beleraknom a tokeneket?????? --- talan megoldva

      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('username', res.username)

      this.correct = true;

      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/home']);
      }, 2500);
    }, err => {
      this.correct = false;
      this.errorMessage = err.error.message;
    });

  }

}
