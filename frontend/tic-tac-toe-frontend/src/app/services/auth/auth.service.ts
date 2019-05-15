import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private loginService: LoginService) { }

  checkAuth(): boolean {
    return !!this.loginService.getCurrentUser();
  }

  logout() {
    this.loginService.logout();
  }

  getAccessToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
}
