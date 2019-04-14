import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router) { }

  totalRooms = <Number>0;
  emptyRooms = <Array<number>>[];
  inGame2: string = null;

  user = {
    username: localStorage.getItem('username')
  }


  ngOnInit() {

    if (this.gameService.inGame()) {
      this.inGame2 = "igen";
    }
    

    // ha egy user epp jatszik, es erre az oldalra navigal egy masik tabrol, akkor vagy eliranyitani a profiljara pl, vagy kiirni egy 
    // uzenetet, hogy epp jatszik, nem tud csatlakozni mas jatekokhoz es nem is tud letrehozni
    // ez az uzenet megjelenhet ugy, hogy nem a jatekok vannak, meg a create room, hanem csak siman az uzenet
    // if (this.gameService.inGame()) {
    //   this.returnToLobby();
    // }

    this.authService.checkAuth();

    this.gameService.connect();

    // HTTP call to get Empty rooms and total room numbers
    this.gameService.getRoomStats().then(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });

    this.gameService.getRoomsAvailable().subscribe(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
    });
  }

  
  returnToLobby() {
    this.router.navigate(['/home']);
  }


  createRoom() {
    this.gameService.createNewRoom(this.user).subscribe((response) => {
      localStorage.setItem('inGame', 'true');
      this.router.navigate(['/home/play']);
    });
  }

  joinRoom(roomName) {
    // itt megkene varni, hogy lehet e joinolni, vagy sem --> .subscribe(), es ha lehet, akkor navigal csak at!!
    this.gameService.joinNewRoom(roomName).subscribe((response) => {
      localStorage.setItem('inGame', 'true');
      // ha a jatekos mar jatekban van egy kliensbol, es csatlakozni akarunk pl. a sajat jatekonhoz, amit letre hoztunk egy
      // kliensbol, akkor is atnagival. Ezt valahogy megoldani, hogy ilyen ne legyen
      this.router.navigate(['/home/play']);
    });

  }



}
