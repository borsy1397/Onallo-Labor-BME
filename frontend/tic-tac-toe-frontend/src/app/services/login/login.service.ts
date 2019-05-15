import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { User } from 'src/app/model/User';
import { LoginUser } from '../../model/LoginUser';
import { CurrentUser } from 'src/app/model/CurrentUser';
import { AppSettings } from 'src/app/config';

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
    return this.http.post<any>(AppSettings.API_ENDPOINT + "/login", user);
  }

  logout() {
    this.currentUser = null;
  }

}
