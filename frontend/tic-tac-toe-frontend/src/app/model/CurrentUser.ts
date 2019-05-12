import { Game } from './Game';
export interface CurrentUser {
    id: string;
    username: string;
    email: string;
    games: Game;
    joined: Date;
    points: number;
    win: number;
    draw: number;
    lost: number;
}