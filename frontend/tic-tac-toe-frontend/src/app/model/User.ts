import { Game } from './Game';
export interface User {
    username: string;
    email: string;
    games: Game;
    joined: Date;
    points: number;
    win: number;
    draw: number;
    lost: number;
}