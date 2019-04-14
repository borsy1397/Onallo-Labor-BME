import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../../model/Message';

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

	sendMove(moveDetails) {
		if (this.socket != null) {
			console.log(moveDetails);
			this.socket.emit('send-move', moveDetails);
		}
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


	sendMessage(data) {
		if (this.socket != null) {
			this.socket.emit('send-message', data);
		}
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

	getRoomStats() {
		return new Promise(resolve => {
			this.http.get(`http://localhost:3000/getGames`).subscribe(data => {
				resolve(data);
			});
		});
	}

	getRoomsAvailable(): any {
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

			console.log(this.socket.decodedUsername);
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

	playerLeft(): any {
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

	disconnect() {
		if (this.socket != null) {
			this.socket.disconnect();
		}
	}

	inGame(): boolean {
		return !!localStorage.getItem('inGame');
	}
}



/*

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../../model/Message';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	constructor(private http: HttpClient) { }

	socket = null;

	connect() {
		this.socket = io('http://localhost:3000');
	}

	sendMessage(data) {
		this.socket.emit('send-message', data);
	}

	receiveMessage(): Observable<Message> {
		const observable = new Observable(observer => {
			this.socket.on('receive-message', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
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

		const observable = new Observable(observer => {
			this.socket.on('new-room', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	getRoomStats() {
		return new Promise(resolve => {
			this.http.get(`http://localhost:3000/getGames`).subscribe(data => {
				resolve(data);
			});
		});
	}

	getRoomsAvailable(): any {
		const observable = new Observable(observer => {
			this.socket.on('rooms-available', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	joinNewRoom(roomName): any {
		this.socket.emit('join-room', {
			'roomName': roomName,
			'username': localStorage.getItem('username')
		});
	}

	startGame(): any {
		const observable = new Observable(observer => {
			this.socket.on('start-game', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	playerLeft(): any {
		const observable = new Observable(observer => {
			this.socket.on('room-disconnect', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}

	disconnect() {
		if (this.socket != null) {
			this.socket.disconnect();
		}
	}

	inGame(): boolean {
		return !!localStorage.getItem('inGame');
	}
}
*/