import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'src/app/model/User';
import { LoginUser } from '../../model/LoginUser';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  login(user: LoginUser) { 
    // nem any-t kapunk vissza, hanem vissza kell kuldeni a bejelentkezett usert.
    return this.http.post<any>("http://localhost:3000/login", user);
  }
}
