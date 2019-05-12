import { Component, OnInit, Input } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Message } from 'src/app/model/Message';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) { }

  roomName: string = null;
  enemyName: string = null;
  myname: string = localStorage.getItem('username');

  messages: Message[] = [];
  message: string = "";

  myTurn: boolean = null;
  myShape: string = null;
  enemyShape: string = null;
  whichGrid: string = null;

  returnToLobby() {
    this.router.navigate(['/home/games']);
  }

  ngOnInit() {

    if (!this.gameService.inGame()) {
      this.returnToLobby();
    }

    this.spinner.show();

    window.onbeforeunload = () => this.ngOnDestroy();

    this.gameService.startGame().subscribe((response) => {
      this.roomName = response['roomName'];
      this.spinner.hide();
      if (this.myname === this.roomName) {
        this.enemyName = response['ellenfel'];
        this.myShape = 'x';
        this.enemyShape = 'o';
        document.querySelector(`#you`).classList.add("whose-turn");
        document.querySelector(`#you h4`).classList.add(`shape-${this.myShape}`);
        document.querySelector(`#enemy h4`).classList.add(`shape-${this.enemyShape}`);
        this.myTurn = true;
      } else {
        this.enemyName = this.roomName;
        this.myShape = 'o';
        this.enemyShape = 'x';
        document.querySelector(`.game-board`).classList.add("enemy-round");
        document.querySelector(`#enemy`).classList.add("whose-turn");
        document.querySelector(`#you h4`).classList.add(`shape-${this.myShape}`);
        document.querySelector(`#enemy h4`).classList.add(`shape-${this.enemyShape}`);
        this.myTurn = false;
      }
    });

    this.gameService.receiveMessage().subscribe((socketResponse: Message) => {
      this.messages = [...this.messages, socketResponse];
    });

    this.gameService.receiveMove().subscribe(response => {
      this.whichGrid = response['whichGrid'];

      if (this.myTurn) {
        this.renderMove(this.whichGrid, this.myShape);
        this.myTurn = false;
        document.querySelector(`#enemy`).classList.add("whose-turn");
        document.querySelector(`#you`).classList.remove("whose-turn");
        document.querySelector(`.game-board`).classList.add("enemy-round");

      } else {
        this.renderMove(this.whichGrid, this.enemyShape);
        this.myTurn = true;
        document.querySelector(`#you`).classList.add("whose-turn");
        document.querySelector(`.game-board`).classList.remove("enemy-round");
        document.querySelector(`#enemy`).classList.remove("whose-turn");
      }
    });

    this.gameService.gameEnd().subscribe(response => {
      if (response['draw']) {
        alert('DRAW!');
      } else {
        if (response['winner'] == this.enemyName) {
          alert('You lost :( The winner is: ' + response['winner']);
        } else {
          alert('Congratulations! You are the winner! :)');
        }

      }
      this.returnToLobby();

    });

    this.gameService.playerLeft().subscribe(() => {
      alert('Player Left! You are the winner! Congratulations! :)');
      this.returnToLobby();
    });
  }

  renderMove(grid: string, shape: string) {
    document.querySelector(`#button_${grid}`).innerHTML = shape;
    document.querySelector(`#button_${grid}`).classList.add(`shape-${shape}`);
  }

  sendMove(grid) {
    if (this.myTurn) {
      this.gameService.sendMove({
        myMove: this.myname,
        whichGrid: +grid
      });
    }
  }


  sendMessage() {
    this.message = this.message.trim();
    if (this.message.length > 0) {
      this.gameService.sendMessage({
        from: this.myname,
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
