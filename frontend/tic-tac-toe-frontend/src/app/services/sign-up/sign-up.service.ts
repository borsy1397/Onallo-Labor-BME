import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpUser } from '../../model/SignUpUser';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  signUp(user: SignUpUser) {
    return this.http.post("http://localhost:3000/users", user);
  }
  
}
