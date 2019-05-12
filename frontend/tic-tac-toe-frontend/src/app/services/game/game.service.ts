import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../../model/Message';
import { RoomsAvailevable } from 'src/app/model/RoomsAvailevable';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	constructor(private http: HttpClient) { }

	socket = null;

	connect() {
		this.socket = io('http://localhost:3000', {
			query: { token: localStorage.getItem('token') }
		});
	}

	inGame(): boolean {
		return !!localStorage.getItem('inGame');
	}

	gameEnd(): any {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('game-end', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	receiveMove(): any {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('receive-move', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	receiveMessage(): Observable<Message> {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('receive-message', (data) => {
					observer.next(data);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	createNewRoom(data): any {
		if (this.socket != null) {
			this.socket.emit('create-room', { 'username': data.username });
		}

		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('new-room', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	getRoomsAvailable(): Observable<RoomsAvailevable> {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('rooms-available', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	joinNewRoom(roomName): any {
		if (this.socket != null) {
			this.socket.emit('join-room', {
				'roomName': roomName,
				'username': localStorage.getItem('username')
			});
		}

		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('goto-play', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	startGame(): any {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('start-game', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	playerLeft(): Observable<null> {
		return new Observable(observer => {
			if (this.socket != null) {
				this.socket.on('room-disconnect', (data) => {
					observer.next(
						data
					);
				});
				return () => {
					this.socket.disconnect();
				};
			}
		});
	}

	getRoomStats(){
		return new Promise(resolve => {
			this.http.get(`http://localhost:3000/games`).subscribe(data => {
				resolve(data);
			});
		});
	}

	sendMove(moveDetails) {
		if (this.socket != null) {
			this.socket.emit('send-move', moveDetails);
		}
	}

	sendMessage(data) {
		if (this.socket != null) {
			this.socket.emit('send-message', data);
		}
	}

	disconnect() {
		if (this.socket != null) {
			this.socket.disconnect();
		}
	}
}
