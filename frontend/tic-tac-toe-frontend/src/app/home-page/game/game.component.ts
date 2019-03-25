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

  user = {
    username: localStorage.getItem('username')
  }


  ngOnInit() {

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


  createRoom() {
    this.gameService.createNewRoom(this.user).subscribe((response) => {
      localStorage.setItem('inGame', 'true');
      this.router.navigate(['/home/play']);
    });
  }

  joinRoom(roomName) {
    this.gameService.joinNewRoom(roomName);
    localStorage.setItem('inGame', 'true');
    this.router.navigate(['/home/play']);
  }

}
