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

  private totalRooms = <Number> 0;
	private emptyRooms = <Array<number>> [];
  private roomNumber = <Number> 0;
  private enemy = null;

  user = {
    username: localStorage.getItem('username')
  }


  ngOnInit() {

    this.authService.checkAuth() // eleg csak ennyi

    this.gameService.connect();

    // HTTP call to get Empty rooms and total room numbers
		this.gameService.getRoomStats().then(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
		});

		// Socket evenet will total available rooms to play.
		this.gameService.getRoomsAvailable().subscribe(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
    });
    
    this.gameService.startGame().subscribe((response) => {
      this.roomNumber = response['roomNumber'];
      this.enemy = response['ellenfel'];
      this.router.navigate(['/home/play']);
    });
    
    		// Socket event to check if any player left the room, if yes then reload the page.
		this.gameService.playerLeft().subscribe((response) => {
      alert('Player Left, You are the winner');
		});

  }


  createRoom() {
    this.gameService.createNewRoom(this.user).subscribe((response) => {
      this.roomNumber = response.roomNumber;
    });
  }

  joinRoom(roomNumber) {
		this.gameService.joinNewRoom(roomNumber);
	}

}
