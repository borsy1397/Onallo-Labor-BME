socket.on('send-move', move => {
    // vagy nem elkuldjuk a room nevet, hanem kiszedjuk:
    // const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    const roomName = move.roomName;
    // Ez erdekes helyzet: Az ellenfel ne kuldhessen a masik jatekos neveben lepest!!!!!!!!!
    const whoseMove = move.myMove;
    const whichGrid = move.grid;

    Promise.all(['games', 'usersInGame', 'allRooms', 'totalRoomCount'].map(key => redisDB.getAsync(key))).then(values => {
        const games = JSON.parse(values[0])['games'];
        let usersInGame = JSON.parse(values[1])['users'];
        const allRooms = JSON.parse(values[2]);
        let fullRooms = allRooms['fullRooms'];
        let totalRoomCount = values[3];

        let jatek = null;
        // ide szep forEachet irni!!!
        let gameIndex = null;
        for (gameIndex = 0; gameIndex < games.length; gameIndex++) {
            if (games[gameIndex].id === roomName) {
                jatek = games[gameIndex];
            }
        }

        if (jatek) {
            if (jatek.whoseMove === whoseMove) {
                /**
                 * itt kell majd egy if, hogy a lepes az megfelelo mezore tortent e
                 * ha jo mezore, akkor megvizsgalni, hogy vege e a jateknak
                 * van e egyaltalan ilyen mezo? amit kuldd a user... megvizsgalni, hogy valid e - 1-2-4-8-16....
                 */

                /*const lol = {
                    id: 
                    whoseMove: player1,
                    users: ['player1', 'player2'],
                    type: ['x', 'o'],
                    scores: ['score1', 'score2'],
                    gameState: [1,2,4,8,....]
                }*/

                const isOkayMove = jatek.gameState.includes(whichGrid);

                if (!isOkayMove) {

                    /**
                     * na itt ezt szepen megirni, hogy melyik poziciot frissitse!!!!
                     */
                    let indexx = null;
                    if (whoseMove === jatek.users[0]) {
                        indexx = 0;
                    } else {
                        indexx = 1;
                    }

                    jatek.scores[indexx] += whichGrid;
                    jatek.gameState.push(whichGrid);


                    const wins = [7, 56, 448, 73, 146, 292, 273, 84];
                    wins.forEach((winningPosition) => {
                        if ((winningPosition & jatek.scores[indexx]) === winningPosition) {
                            // JATEK VEGE!!!!
                            // kiszedni a games-bol az aktualis jatekot, illetve a full roomsbol, meg a usersInGamebol is
                            // eltarolni mindket usernel a GameResultot

                            games.splice(gameIndex, 1);

                            /*let usersInGamePos = usersInGame.indexOf(socket.id);
                            if (usersInGamePos > -1) {
                                usersInGame.splice(usersInGamePos, 1);
                                redisDB.set("usersInGame", JSON.stringify({
                                    users: usersInGame
                                }));
                            }

                            let fullRoomsPos = fullRooms.indexOf(roomName);
                            if (fullRoomsPos > -1) {
                                fullRooms.splice(fullRoomsPos, 1);
                                totalRoomCount--;
                            }*/
                            
                            // receive movet ide is!!!!
                            io.sockets.in("room-" + roomName).emit('receive-move', {
                                'whoseTurn': null,
                                'roomName': null,
                                'whichGrid': whichGrid
                            });

                            io.sockets.in("room-" + roomName).emit('game-end', {
                                'draw': false,
                                'winner': whoseMove
                            });
                        }
                    });

                    if (jatek.gameState.length >= 9) {


                        games.splice(gameIndex, 1);

                        //dontetlen
                        io.sockets.in("room-" + roomName).emit('receive-move', {
                            /**
                             * eldonteni, hogy aztadjuk vissza, hogy ki jon, vagy vagy hogy ki volt, de szerintem ez jo igy.
                             * Max annyi, hogy erthetobben elnevezni, pl. WhoIsNext
                             */
                            'whoseTurn': null,
                            'roomName': null,
                            'whichGrid': whichGrid
                        });

                        io.sockets.in("room-" + roomName).emit('game-end', {
                            'draw': true,
                            'winner': null
                        });
                        //eltarolni mindket usernel a GameResultot
                    } else {
                        games[gameIndex] = jatek;
                        redisDB.set('games', JSON.stringify({
                            games: games
                        }));

                        io.sockets.in("room-" + roomName).emit('receive-move', {
                            'whoseTurn': indexx === 0 ? jatek.users[1] : jatek.users[0],
                            'roomName': roomName,
                            'whichGrid': whichGrid
                        });
                    }
                    // if dontetlen
                    // kulonben jatek megy tovabb


                    /*games[i] = jatek;
                    redisDB.set('games', JSON.stringify({
                        games: games
                    }));

                    io.sockets.in("room-" + roomName).emit('receive-move', {
                        'whoseTurn': idePlayerNametIrni,
                        'roomName': roomName
                    });*/
                }
            }
        }
    });
});

/**
 *
 * TODO:
 * - a redisbeli game listabol kiszedni a megfelelo jatekot
 * - eltarolni a jatek aktualis allasat
 * - kliens oldalon nyilvan letiltani azt, amit nem lehet lepni, viszont szerveroldalon is ellenorizni, hogy valid-e
 *   a lepes. Vagy, ha rosszat akar lepni, akkor emitelni? Vagy csak nem reagalni ra? pontosabban ne emiteljunk semmit?
 * - Figyelni, hogy ha az a jatekos tudna a kliensoldali tiltas elleneri send-moveolni, akkor azt ne fogadjuk el
 *   Ezt ellenorizni, hogy ki jon
 * - NEM IS KELL UJ CUCC A REDISBE (GAMES), HANEM A FULLROOMS AZ TOK JO!!!!!! Vagy lehet nem.........ű
 * - kiszervezni kulon osztalyba a Game objekumot
 */
