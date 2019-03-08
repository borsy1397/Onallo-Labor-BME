import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Ide lehet kell majd a http, ha a backendnek kuldunk egy kerest, hogy a felhasznalo be van a jelentkezve
   */

  constructor() { }

  checkAuth(): boolean {
    return !!localStorage.getItem('token');
  }

  getAccessToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
}
