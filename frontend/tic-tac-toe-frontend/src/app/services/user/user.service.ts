import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RankUserObject } from 'src/app/model/RankUserObject';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/model/User';
import { LoginService } from '../login/login.service';
import { AppSettings } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getRank(): Observable<RankUserObject> {
    return this.http.get<RankUserObject>(AppSettings.API_ENDPOINT + "/users");
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(AppSettings.API_ENDPOINT + `/users/${id}`);
  }

  getUserByUsername(name: string): Observable<User> {
    return this.http.get<User>(AppSettings.API_ENDPOINT + `/users/search/${name}`);
  }

  deleteUserById(){
    return this.http.delete<any>(AppSettings.API_ENDPOINT + `/users/${this.loginService.getCurrentUser().id}`);
  }
}
