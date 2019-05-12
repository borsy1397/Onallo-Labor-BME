import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router) { }

  totalRooms = <Number>0;
  usersInGame = <Number>0;
  emptyRooms = <Array<number>>[];
  inGame2: string = null;

  user = {
    username: localStorage.getItem('username')
  }

  ngOnInit() {

    if (this.gameService.inGame()) {
      this.inGame2 = "igen";
    }

    this.authService.checkAuth();

    this.gameService.getRoomStats().then(response => {
      this.totalRooms = response['totalRoomCount'];
      this.emptyRooms = response['emptyRooms'];
      this.usersInGame = response['usersInGame'];
    });

    this.gameService.connect();

    this.gameService.getRoomsAvailable().subscribe(response => {
      this.totalRooms = response.totalRoomCount;
      this.emptyRooms = response.emptyRooms;
      this.usersInGame = response.usersInGame;
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
    this.gameService.joinNewRoom(roomName).subscribe((response) => {
      localStorage.setItem('inGame', 'true');
      this.router.navigate(['/home/play']);
    });

  }



}
