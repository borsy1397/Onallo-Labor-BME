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

    window.onbeforeunload = () => this.ngOnDestroy();

    this.gameService.startGame().subscribe((response) => {
      this.roomName = response['roomName'];

      if (this.myname === this.roomName) {
        this.enemyName = response['ellenfel'];
        this.myShape = 'x';
        document.querySelector(`#you`).classList.add("whose-turn");
        this.enemyShape = 'o';
        this.myTurn = true;
      } else {
        this.enemyName = this.roomName;
        this.myShape = 'o';
        this.enemyShape = 'x';
        document.querySelector(`#enemy`).classList.add("whose-turn");
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
      } else {
        this.renderMove(this.whichGrid, this.enemyShape);
        this.myTurn = true;
        document.querySelector(`#you`).classList.add("whose-turn");
        document.querySelector(`#enemy`).classList.add("whose-turn");
      }
    });

    this.gameService.gameEnd().subscribe(response => {
      if (response['draw']) {
        alert('DRAW');
      } else {
        alert('THE WINNER IS:' + response['winner']);
      }
      this.returnToLobby();

      // es itt majd csinalni csudijo dolgokat, pl. animacio hogy keresztbehuzzok a nyero reszt, meg gratulalunk, meg minden
      //vagyis szerintem ezt itt kell majd

    })

    this.gameService.playerLeft().subscribe((response) => {
      alert('Player Left, You are the winner');
      this.returnToLobby();
    });
  }

  renderMove(grid: string, shape: string) {
    console.log(grid);
    //document.querySelector(`#button_${grid}`).classList.add(`shape-${shape}`);
    document.querySelector(`#button_${grid}`).innerHTML = shape;
  }

  sendMove(grid) {
    // itt is ellenorizni majd minden szir szart, hogy nem e lepett mar e oda, meg ilyesmi
    // szerveroldalon persze ez le van kezelve, de hogy meglegyen a jatek elmeny..
    if (this.myTurn) {
      console.log("SAJAT KLIKK");
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
