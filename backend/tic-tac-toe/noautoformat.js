socket.on('send-move', move => {
    // vagy nem elkuldjuk a room nevet, hanem kiszedjuk:
    // const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    const roomName = move.roomName;
    // Ez erdekes helyzet: Az ellenfel ne kuldhessen a masik jatekos neveben lepest!!!!!!!!!
    const whoseMove = move.myMove;
    const whichGrid = move.grid;

    Promise.all(['games'].map(key => redisDB.getAsync(key))).then(values => {
        const games = JSON.parse(values[0])['games'];


        let jatek = null;
        // ide szep forEachet irni!!!
        for (i = 0; i < games.length; i++) {
            if (games[i].id === roomName) {
                jatek = games[i];
            }
        }

        if (jatek) {
            if (jatek.whoseMove === whoseMove) {
                /**
                 * itt kell majd egy if, hogy a lepes az megfelelo mezore tortent e
                 * ha jo mezore, akkor megvizsgalni, hogy vege e a jateknak
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
                    if (whoseMove === 'player1') {
                        indexx = 0;
                    } else {
                        indexx = 1;
                    }

                    jatek.scores[indexx] += whichGrid;


                    const wins = [7, 56, 448, 73, 146, 292, 273, 84];
                    wins.forEach((winningPosition) => {
                        if ((winningPosition & jatek.scores[indexx]) === winningPosition) {
                            // JATEK VEGE!!!!
                            // kiszedni a games-bol az aktualis jatekot, illetve a full roomsbol, meg a usersInGamebol is
                        } else {
                            // if dontetlen
                            // kulonben jatek megy tovabb
                        }
                    });


                    games[i] = jatek;
                    redisDB.set('games', JSON.stringify({
                        games: games
                    }));

                    io.sockets.in("room-" + roomName).emit('receive-move', {
                        'whoseTurn': idePlayerNametIrni,
                        'roomName': roomName
                    });
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
