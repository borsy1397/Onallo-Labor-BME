import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

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

	receiveMessage() {
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
	}

	createNewRoom(data): any {
		this.socket.emit('create-room', { 'username': data.username });
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
