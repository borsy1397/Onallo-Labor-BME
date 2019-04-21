import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService) { }
  user: User = null;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUserByUsername(localStorage.getItem('username')).subscribe(response => {
      this.user = response;
      console.log(this.user);
    });
  }
  

}
