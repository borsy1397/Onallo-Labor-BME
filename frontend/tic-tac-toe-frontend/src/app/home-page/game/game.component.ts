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

  totalRooms = <Number> 0;
	emptyRooms = <Array<number>> [];
  roomName: string;
  enemy = null;
  amIRoomCreator: boolean = false;

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
    
    /*this.gameService.startGame().subscribe((response) => {
      this.roomName = response['roomName'];
      this.enemy = response['ellenfel'];
      this.router.navigate(['/home/play']);
    });*/
    
    		// Socket event to check if any player left the room, if yes then reload the page.
		/*this.gameService.playerLeft().subscribe((response) => {
      alert('Player Left, You are the winner');
		});*/

  }


  createRoom() {
    this.gameService.createNewRoom(this.user).subscribe((response) => {
      //this.roomName = response.roomName;
      //this.amIRoomCreator = true;
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
