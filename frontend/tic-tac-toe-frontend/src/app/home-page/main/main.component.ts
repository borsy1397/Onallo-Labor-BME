import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    if(!this.authService.checkAuth()){
      this.router.navigate(['/login']);
    }
    
    // ezt innen nyilvan ki kell szedni
    this.userService.getUser().subscribe(res => {
      console.log("Angular home path, van token, ervenyes, es a szerver vissza kuldi a /user routera a cuccot");
      console.log(res);
      console.log("----------------------------------");
    }, err => {
      console.log("Angular home path, /user routera  a backend hibat ir, mert nincs vagy nem jo a token");
      console.log(err);
      console.log("Angular home path, /user routera  a backend hibat ir, mert nincs vagy nem jo a token");
    });
  }

}
