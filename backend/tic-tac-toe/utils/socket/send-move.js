const GameResult = require('../../models/GameResult');
const User =  require('../../models/User');


module.exports = (io, socket, redisDB, move) => {

    // majd mindenhol vizsgazni, hogy egyaltalan van e socket, meg ilyenek, lol
    // tehat pl valaki valahogyan siman kuld egy send-movet anelkul, hogy jatekban lenne


    // vagy nem elkuldjuk a room nevet, hanem kiszedjuk:
    // const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    const roomName = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    //const roomName = move.roomName;
    // Ez erdekes helyzet: Az ellenfel ne kuldhessen a masik jatekos neveben lepest!!!!!!!!!
    // esetleg ezt meglehetne ugy csinalni, hogy itt a socketID-t nezzuk, es nem a nevet. pl. whoseMove = socket.id
    // ekkor viszont lehet uyganugy kell egy tombot tarolni, vagy fasz se tudja
    const whoseMove = move.myMove;
    const whichGrid = move.whichGrid;

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
                console.log('ciklusban jatek: ');
                console.log(jatek);
                break;
                // ide kell majd egy break
            }
        }
        console.log('Jatekok tomb splice elott:');
        console.log("Game index: " + gameIndex);
        console.log(games);

        for (i = 0; i < games.length; i++) {
            if (games[i].id == roomName) {
                games.splice(i, 1);
                break;
            }
        }

        //games.splice(gameIndex-2, 1);
        console.log('Jatekok tomb splice utan:');
        console.log(games);

        //console.log('Bejottunk a sendmoveba: gameindex es jatek   ' + gameIndex + "     " + jatek)

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
                const valid = [1, 2, 4, 8, 16, 32, 64, 128, 256];
                positionValid = false;
                valid.forEach((validPosition) => {
                    if (validPosition === whichGrid) {
                        positionValid = true;
                    }
                });

                const isOkayMove = jatek.gameState.includes(whichGrid);

                if (!isOkayMove && positionValid) {

                    /**
                     * na itt ezt szepen megirni, hogy melyik poziciot frissitse!!!!
                     */
                    let indexx = null;
                    if (whoseMove === jatek.users[0]) {
                        indexx = 0;
                    } else {
                        indexx = 1;
                    }

                    const whoIsNext = indexx === 0 ? jatek.users[1] : jatek.users[0];

                    jatek.scores[indexx] += whichGrid;
                    jatek.gameState.push(whichGrid);
                    jatek.whoseMove = whoIsNext;

                    const wins = [7, 56, 448, 73, 146, 292, 273, 84];
                    wins.forEach((winningPosition) => {
                        if ((winningPosition & jatek.scores[indexx]) === winningPosition) {

                            // Ha vege a jateknak, akkor itt kileptetni valahogy mindenkit, vagy majd disconnectnel ezt ugyis megcsinaljuk?
                            // JATEK VEGE!!!!
                            // kiszedni a games-bol az aktualis jatekot, illetve a full roomsbol, meg a usersInGamebol is
                            // eltarolni mindket usernel a GameResultot

                            User.findOne({ username: whoseMove })
                                .exec()
                                .then(user => {
                                    if (!user) {
                                        console.log("nincs is ilyen user, lol");
                                    } else {
                                        User.findOne({ username: whoIsNext })
                                            .exec()
                                            .then(user2 => {
                                                if (!user2) {
                                                    console.log("nincs is ilyen user, lol");
                                                } else {

                                                    const gameResultWin = new GameResult({
                                                        //_id: new mongoose.Types.ObjectId(),
                                                        draw: false,
                                                        win: true,
                                                        enemy: user2 // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
                                                        // De faszom, itt csak a stringet tudjuk, tehat csak a nevet. Le kell kerdezni az ID-t
                                                        // ki kell olvasnunk az adatbazisbol!!!! Users.find(....)
                                                        // at kell majd gondolni, hogy alapjaiba veve megvaltoztatjuk a strukturajat a programnak, hogy
                                                        // pl. id-t tarolunk a jatek kozben, meg a fullroomsnal, meg ilyesmi.
                                                    });

                                                    gameResultWin
                                                        .save()
                                                        .then(result => {
                                                            console.log(result);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });

                                                    const gameResultLose = new GameResult({
                                                        //_id: new mongoose.Types.ObjectId(),
                                                        draw: false,
                                                        win: false,
                                                        enemy: user // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
                                                        // De faszom, itt csak a stringet tudjuk, tehat csak a nevet. Le kell kerdezni az ID-t
                                                        // ki kell olvasnunk az adatbazisbol!!!! Users.find(....)
                                                        // at kell majd gondolni, hogy alapjaiba veve megvaltoztatjuk a strukturajat a programnak, hogy
                                                        // pl. id-t tarolunk a jatek kozben, meg a fullroomsnal, meg ilyesmi.

                                                    });

                                                    gameResultLose
                                                        .save()
                                                        .then(result => {
                                                            console.log(result);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });

                                                    // A USERHEZ IS EL KELL MENTENI!!!!!! szoval le kell kerni a usereket

                                                    user2.games.push(gameResultLose);
                                                    user2.save().then(result => {
                                                        console.log(result);
                                                    });

                                                    user.games.push(gameResultWin);
                                                    user.save().then(result => {
                                                        console.log(result);
                                                    });

                                                }
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });

                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });


                            //games.splice(gameIndex, 1);

                            // DISCONNECTHEZ IS GAME RESULT




                            // receive movet ide is!!!!
                            io.sockets.in("room-" + roomName).emit('receive-move', {
                                'whoseTurn': null,
                                //'roomName': null,
                                'whichGrid': whichGrid
                            });

                            io.sockets.in("room-" + roomName).emit('game-end', {
                                'draw': false,
                                'winner': whoseMove
                            });
                        }
                    });

                    if (jatek.gameState.length >= 9) {




                        User.findOne({ username: whoseMove })
                            .exec()
                            .then(user => {
                                if (!user) {
                                    console.log("nincs is ilyen user, lol");
                                } else {

                                    const gameResultDraw = new GameResult({
                                        //_id: new mongoose.Types.ObjectId(),
                                        draw: true,
                                        win: false,
                                        enemy: whoIsNext // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
                                        // De faszom, itt csak a stringet tudjuk, tehat csak a nevet. Le kell kerdezni az ID-t
                                        // ki kell olvasnunk az adatbazisbol!!!! Users.find(....)
                                        // at kell majd gondolni, hogy alapjaiba veve megvaltoztatjuk a strukturajat a programnak, hogy
                                        // pl. id-t tarolunk a jatek kozben, meg a fullroomsnal, meg ilyesmi.

                                    });

                                    gameResultDraw
                                        .save()
                                        .then(result => {
                                            console.log(result);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });

                                    user.games.push(gameResultDraw);
                                    user.save().then(result => {
                                        console.log(result);
                                    });

                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });


                        User.findOne({ username: whoIsNext })
                            .exec()
                            .then(user => {
                                if (!user) {
                                    console.log("nincs is ilyen user, lol");
                                } else {

                                    const gameResultDraw = new GameResult({
                                        //_id: new mongoose.Types.ObjectId(),
                                        draw: true,
                                        win: false,
                                        enemy: whoseMove // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
                                        // De faszom, itt csak a stringet tudjuk, tehat csak a nevet. Le kell kerdezni az ID-t
                                        // ki kell olvasnunk az adatbazisbol!!!! Users.find(....)
                                        // at kell majd gondolni, hogy alapjaiba veve megvaltoztatjuk a strukturajat a programnak, hogy
                                        // pl. id-t tarolunk a jatek kozben, meg a fullroomsnal, meg ilyesmi.

                                    });

                                    gameResultDraw
                                        .save()
                                        .then(result => {
                                            console.log(result);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });

                                    // A USERHEZ IS EL KELL MENTENI!!!!!! szoval le kell kerni a usereket

                                    user.games.push(gameResultDraw);
                                    user.save().then(result => {
                                        console.log(result);
                                    });

                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });

                        //game result itt is!!!

                        //games.splice(gameIndex, 1);

                        //dontetlen
                        io.sockets.in("room-" + roomName).emit('receive-move', {
                            /**
                             * eldonteni, hogy aztadjuk vissza, hogy ki jon, vagy vagy hogy ki volt, de szerintem ez jo igy.
                             * Max annyi, hogy erthetobben elnevezni, pl. WhoIsNext                                
                             */
                            'whoseTurn': null,
                            //'roomName': null,
                            'whichGrid': whichGrid
                        });

                        io.sockets.in("room-" + roomName).emit('game-end', {
                            'draw': true,
                            'winner': null
                        });
                        //eltarolni mindket usernel a GameResultot
                    } else {
                        games.push(jatek);
                        redisDB.set('games', JSON.stringify({
                            games: games
                        }));

                        //console.log('Sima lepes, eltaroljuk: gameindex es jatek   ' + gameIndex + "     " + jatek)

                        io.sockets.in("room-" + roomName).emit('receive-move', {
                            'whoseTurn': whoIsNext,
                            //'roomName': roomName,
                            'whichGrid': whichGrid
                        });
                    }
                }
            }
        }
    });
};