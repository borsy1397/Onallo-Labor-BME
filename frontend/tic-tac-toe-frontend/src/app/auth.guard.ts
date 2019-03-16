import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

// CanActivateChild kell?????
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.checkAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}