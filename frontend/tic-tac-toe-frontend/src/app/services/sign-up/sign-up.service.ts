import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  signUp(user) {
    return this.http.post("http://localhost:3000/users", user);
  }
  
}
