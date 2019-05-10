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

    /**
     * Ezzel valami kezdeni, hogy ne ketszer kuldje el, vagy mi
     */
    return next.handle(authReq).pipe(tap(event => {
      //ezt a pipos faszsagot lehet el kell tuntetni
      console.log("Nincs hiba a tokennel - interceptor");
      console.log(event);
      console.log("-------------------------------------------------------------");
    }, error => {
      if(error.status === 401) {
        console.log("Lejart, vagy invalid token");
        localStorage.clear();
        this.router.navigate(['/login']);
    }
  }));
  }
}




        /*const refreshData = {
          refreshToken: localStorage.getItem('refreshToken'),
          username: "username1"
        }

        

         return this.http.post<any>('http://localhost:3000/token', refreshData).subscribe(res => {
          console.log(res.status);
            if(res.status == 200) {
              //localStorage.setItem('refreshToken', newRefreshToken);
              localStorage.setItem('token', res.token);

              authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${this.authService.getAccessToken()}`)
              });


              return next.handle(authReq).pipe(tap(event => {
                console.log("Ez a belso keres, itt nincs hiba a tokennel a frissites utan");
                console.log(event);
              }, error => {
                if(error){
                  console.log("Most kell kileptetni, es atiranyitani a bejelentkezo oldalra");
                  console.log(error);
                }
              }));
            }
          }
        );

      } else {
        console.log("Nincs is tokened");
        //localStorage.clear();
        //this.router.navigate(['/login']);
      }



    












      

      /*if (error.status === 401) {
        console.log("sdkfasf");
        const refreshData = {
          refreshToken: localStorage.getItem('refreshToken'),
          username: "username1"
        }

        return this.http.post<any>('http://localhost:3000/token', refreshData).subscribe(res => {
            if(res.status == 200) {
              //localStorage.setItem('refreshToken', newRefreshToken);
              localStorage.setItem('token', res.token);

              authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${this.authService.getAccessToken()}`)
              });

              console.log("a kurva anyadat");

              return next.handle(authReq).pipe(tap(event => {
                console.log("Ez a belso keres, itt nincs hiba a tokennel a frissites utan");
                console.log(event);
              }, error => {
                if(error){
                  console.log("Most kell kileptetni, es atiranyitani a bejelentkezo oldalra");
                  console.log(error);
                }
              }));
            }
          }
        );
      
      } else {
        console.log("ki kell leptetni. nem unathorized, hanem nincs tokenje");
        localStorage.clear();
      }
*/

      // 401 authorization???
      /**
       * It is important to check if failed request it’s not the refresh token request itself, to avoid recursion.
       * Also, we need to check if refresh token request is in progress or not because we don’t want other calls to come in and call refreshToken again.
       */

      // Refresh token can be used only once. 

      // Itt kell megvizsgalni, hogy mi a status code, es kuldeni egy requestet a refresh tokennel
      

      /**
       * if (err.status === 401) {
        if (err.error.message == "Token is exp") {
            //TODO: Token refreshing
        }else {
            //Logout from account or do some other stuff
        }
    }
    return Observable.throw(err);
       */
