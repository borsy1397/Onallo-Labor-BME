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
    });
  }

  joined(date: string) {
    return date.substr(0, 10);
  }

  result(win: boolean, draw: boolean) {
    if (draw) {
      return 'DRAW';
    } else if (win) {
      return 'WON';
    } else {
      return 'LOST';
    }
  }

  resColor(win: boolean, draw: boolean) {
    if (draw) {
      return '#f0ad4e';
    } else if (win) {
      return '#5cb85c';
    } else {
      return '#d9534f';
    }
  }

  time(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds - minutes * 60;
    return this.str_pad_left(minutes,'0',2)+':'+ this.str_pad_left(sec,'0',2);
  }

  str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }
}
