import { User } from 'src/app/model/User';
export interface Game {
    win: boolean,
    draw: boolean,
    enemy: User ,
    shape: string,
    playTime: number
}