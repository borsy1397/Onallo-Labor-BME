import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { RankUser } from 'src/app/model/RankUser';

@Component({
  selector: 'app-ranktable',
  templateUrl: './ranktable.component.html',
  styleUrls: ['./ranktable.component.css']
})
export class RanktableComponent implements OnInit {

  constructor(private userService: UserService) { }


  //private users: RankUser[] = [];
  private users: any;
  private position: number = null;

  myName: string = localStorage.getItem('username');

  ngOnInit() {
    this.userService.getRank().subscribe(response => {
      this.users = response.users;
      console.log(this.users);
      this.position = response.myPosition;
      console.log(this.position);
    });
  }

  isMyName(username: string): boolean {
    return this.myName === username ? true : false;
  }

}
