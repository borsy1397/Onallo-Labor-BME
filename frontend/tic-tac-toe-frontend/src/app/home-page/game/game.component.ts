import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

import * as io from 'socket.io-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private gameService: GameService, private authService: AuthService, private router: Router) { }


  socket = null;

  ngOnInit() {

    this.authService.checkAuth() // eleg csak ennyi
    this.socket = io('http://localhost:3000');

  }

  socketClick() {
    this.socket.emit('create-room', {
      my: 'data'
    });
  }

}
