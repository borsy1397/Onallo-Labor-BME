import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router) { }


  roomName: string = null;
  myname: string = localStorage.getItem('username');

  messages = <Array<String>> [];

  returnToLobby() {
    this.router.navigate(['/home/games']);
  }


  ngOnInit() {

    this.authService.checkAuth();
    if (!this.gameService.inGame()) {
      this.router.navigate(['/home/games']);
    } 
    // a /home/play routera navigalni ne lehessen, csak akkor, ha jatekban van
    
    this.gameService.startGame().subscribe((response) => {
      this.roomName = response['roomName'];
    });

    this.gameService.receiveMessage().subscribe((response) => {
      let kuldo = response['kuldo'];
      let uzenet = response['uzenet'];
      console.log(kuldo);
      this.messages.push(`${kuldo}: ${uzenet}`);
    });

    this.gameService.playerLeft().subscribe((response) => {

      // itt mutatni a vegeredmenyt, ha a player eltunik
      alert('Player Left, You are the winner');
    });
  }

  ngOnDestroy(){
    // a /home/play routera navigalni ne lehessen, csak akkor, ha jatekban van
    localStorage.removeItem('inGame');
    this.gameService.disconnect();
  }

  sendMessage() {
    this.gameService.sendMessage({username: this.myname, message: 'anyad'});
  }
}
