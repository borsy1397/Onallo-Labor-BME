import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  login(user) { //majd explicit megmondani, hogy milyen tipusu adat kerul at
    return this.http.post<any>("http://localhost:3000/login", user);
  }
}
