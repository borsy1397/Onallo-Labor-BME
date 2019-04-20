import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RankUserObject } from 'src/app/model/RankUserObject';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // getRank(): Observable<RankUserObject> {
  //   return this.http.get<RankUserObject>("http://localhost:3000/users");
  // }


  getRank(): Observable<any> {
    return this.http.get<any>("http://localhost:3000/users");
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }
}
