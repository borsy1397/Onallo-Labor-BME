import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/model/Message';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router) { }


  roomName: string = null;
  myname: string = localStorage.getItem('username');
  enemyName: string = null;
  messages: Message[] = [];
  message: string = "";

  returnToLobby() {
    this.router.navigate(['/home/games']);
  }


  ngOnInit() {
    // meglehet akadolyozni, hogy refresheljuk a paget????? AZ lenne a legjobb megoldas vagy ez, hogy meghivjuk az ondestroyt????

    if (!this.gameService.inGame()) {
      this.returnToLobby();
    }
    
    window.onbeforeunload = () => this.ngOnDestroy();

    this.gameService.startGame().subscribe((response) => {
      this.roomName = response['roomName'];
      this.enemyName = this.myname === this.roomName ? response['ellenfel'] : this.roomName;
    });

    this.gameService.receiveMessage().subscribe((socketResponse: Message) => {
      this.messages = [...this.messages, socketResponse];
    });

    this.gameService.playerLeft().subscribe((response) => {
      alert('Player Left, You are the winner');
      this.returnToLobby();
    });
  }


  sendMessage() {
    this.message = this.message.trim();
    if (this.message.length > 0) {
      this.gameService.sendMessage({
        from: this.myname,
        //to: 'user2',
        message: this.message
      });
    }
    this.message = "";
  }

  alignMessage(username: string): boolean {
    return this.myname === username ? true : false;
  }
  ngOnDestroy() {
    localStorage.removeItem('inGame');
    this.gameService.disconnect();
  }
}
