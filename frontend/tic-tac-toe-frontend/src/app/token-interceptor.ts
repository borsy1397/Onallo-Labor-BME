import { AuthService } from './services/auth/auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { tap, share, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getAccessToken();

    let authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(authReq).pipe(tap(event => {
      // remove pipe.. do not send 2x
    }, error => {
      if (error.status === 401) {
        localStorage.clear();
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }));
  }
}
