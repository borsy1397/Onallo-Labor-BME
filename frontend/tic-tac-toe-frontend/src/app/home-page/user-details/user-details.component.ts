import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  private user: User;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserById(id).subscribe(response => {
      this.user = response;
      console.log(this.user.games);
    });
  }

}
