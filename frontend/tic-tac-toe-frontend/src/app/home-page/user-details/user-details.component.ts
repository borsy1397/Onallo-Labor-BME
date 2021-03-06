import { Component, OnInit, destroyPlatform } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  user: User = null;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username === localStorage.getItem('username')) {
      this.router.navigate(['/home/profile']);
    } else {
      this.userService.getUserByUsername(username).subscribe(response => {
        this.user = response;
      }, () => {
        this.router.navigate(['/home/games']);
      });
    }
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
    return this.str_pad_left(minutes, '0', 2) + ':' + this.str_pad_left(sec, '0', 2);
  }

  str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

}
