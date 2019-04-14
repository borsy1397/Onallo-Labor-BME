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
  whoseTurn: string = null;
  whichIsActualGridWhatIGetAfterSend: string = null;

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

    this.gameService.receiveMove().subscribe(response => {
      this.whoseTurn = response['whoseTurn'];
      this.whichIsActualGridWhatIGetAfterSend = response['whichGrid'];
      // na ennel kell majd kirajzolni!!!! mittudom, pl. renderActualGameBoard(). ezt a hosszu nevu valtozot bele kell rakni
      // az aktualis tablaba, amit majd csinalok. pl. gameBoard 2 dimenzios matrix (3x3)
      // a fentebb levo response[] cuccokat amugy nem is kell eltarolni. Vagyis de, a whoseTurnet igen, de a masikat nem, mert
      // csak belerakjuk egy gameBoardba, szoval az felesleges.
      // ugyanis felesleges lesz a gameEndben is a drawot eltarolni!!!
    })

    this.gameService.gameEnd().subscribe(response => {
      if(response['draw']) {
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

  sendMove(grid) {
    // itt is ellenorizni majd minden szir szart, hogy nem e lepett mar e oda, meg ilyesmi
    this.gameService.sendMove({
      myMove: this.myname,
      //to: 'user2',
      whichGrid: +grid
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
