import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignUpUser } from '../../model/SignUpUser';
import { AppSettings } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  signUp(user: SignUpUser) {
    return this.http.post(AppSettings.API_ENDPOINT + "/users", user);
  }
  
}
