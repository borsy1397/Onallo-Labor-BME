import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
  }

  user: User;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    /**
     * TODO
     * 
     * Na, szoval szepen meg kellene majd csinalni.
     * Van getUserById es van GetUserByUsername. Ezt majd kiokoskodni, hogy mikor melyiket hasznalni
     * Ha a rank-ról navigál a user a saját accountjára, vagy magára keres rá, akkor nem ez a komponens kell, hanem a profile
     * Ezt ellenőrizni kell valahogy.
     * 
     * A servicokkal kell játszani, mert a usert el kellene tárolni eg yváltozóban, nem a local storageban
     * gitlabon majd megnézni, hogy ez hogy van/lesz megoldva, és csak a servicet kell majd injektálni, úgy meg el van kérve.
     */
    const username = this.route.snapshot.paramMap.get('username');
    // this.userService.getUserById(id).subscribe(response => {
    //   this.user = response;
    //   console.log(this.user.games);
    // });
    this.userService.getUserByUsername(username).subscribe(response => {
      this.user = response;
      console.log(this.user.username);
    });
  }

}
