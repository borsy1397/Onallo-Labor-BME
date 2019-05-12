import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { LoginUser } from '../../model/LoginUser';
import { CurrentUser } from 'src/app/model/CurrentUser';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  currentUser: CurrentUser = null;

  setCurrentUser(user) {
    this.currentUser = user;
  }

  getCurrentUser(): CurrentUser {
    return this.currentUser;
  }

  login(user: LoginUser) {
    // nem any-t kapunk vissza, hanem vissza kell kuldeni a bejelentkezett usert.
    return this.http.post<any>("http://localhost:3000/login", user);
  }
}
