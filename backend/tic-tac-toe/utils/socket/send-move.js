const GameResult = require('../../models/GameResult');
const User = require('../../models/User');


module.exports = (io, socket, redisDB, move) => {
    const roomName = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    // Ez erdekes helyzet: Az ellenfel ne kuldhessen a masik jatekos neveben lepest!!!!!!!!!
    // esetleg ezt meglehetne ugy csinalni, hogy itt a socketID-t nezzuk, es nem a nevet. pl. whoseMove = socket.id
    // ekkor viszont lehet uyganugy kell egy tombot tarolni, vagy fasz se tudja
    // const whoseMove = socket.username ??????
    // az elozoek valamelyikeben irtam, hogy ha a tokent ugyis dekodoljuk, akkor onnan kiolvasni
    // viszont ez majd ott derul ki, hogy minden egyes socket emitnel a frontend oldalon ezt meglehet csinalni (gondolom igen)
    const whoseMove = move.myMove;
    const whichGrid = move.whichGrid;

    Promise.all(['games', 'usersInGame', 'allRooms', 'totalRoomCount'].map(key => redisDB.getAsync(key))).then(values => {
        let games = JSON.parse(values[0])['games'];
        let usersInGame = JSON.parse(values[1])['users'];
        let usersInGameUsername = JSON.parse(values[1])['usersName'];
        const allRooms = JSON.parse(values[2]);
        let fullRooms = allRooms['fullRooms'];
        let emptyRooms = allRooms['emptyRooms'];
        let totalRoomCount = values[3];

        let end_game = false;
        let jatek = null;
        // ide szep forEachet irni!!!
        let gameIndex = null;
        for (gameIndex = 0; gameIndex < games.length; gameIndex++) {
            if (games[gameIndex].id === roomName) {
                jatek = games[gameIndex];
                //console.log('ciklusban jatek: ');
                //console.log(jatek);
                break;
                // ide kell majd egy break
            }
        }
        //console.log('Jatekok tomb splice elott:');
        //console.log("Game index: " + gameIndex);
        //console.log(games);


        //console.log('Jatekok tomb splice utan:');
        //console.log(games);

        //console.log('Bejottunk a sendmoveba: gameindex es jatek   ' + gameIndex + "     " + jatek)

        if (jatek) {
            if (jatek.whoseMove === whoseMove) {
                //console.log('elso ifnel:');
                //console.log(games);

                for (i = 0; i < games.length; i++) {
                    if (games[i].id == roomName) {
                        console.log(games);
                        console.log('-----------Send move')
                        games.splice(i, 1);
                        console.log(games);
                        break;
                    }
                }

                //console.log('ciklus utan:');
                //console.log(games);

                redisDB.set('games', JSON.stringify({
                    games: games
                }));

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
                     * Na amugy ami itt van kod azt sokkal szebbre kene atirni, ha lehet
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
                            end_game = true;

                            //console.log('gyozelem vizsgalat:');
                            //console.log(games);

                            User.findOne({ username: whoseMove })
                                .exec()
                                .then(user => {
                                    if (!user) {
                                        console.log("nincs is ilyen user, lol");
                                    } else {
                                        console.log('elso user:');
                                        console.log(games);
                                        User.findOne({ username: whoIsNext })
                                            .exec()
                                            .then(user2 => {
                                                if (!user2) {
                                                    console.log("nincs is ilyen user, lol");
                                                } else {
                                                    //console.log('masodik user:');
                                                    //console.log(games);
                                                    const gameResultWin = new GameResult({
                                                        draw: false,
                                                        win: true,
                                                        enemy: user2 
                                                    });

                                                    gameResultWin
                                                        .save()
                                                        .then(result => {
                                                            // console.log(result);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });

                                                    const gameResultLose = new GameResult({
                                                        draw: false,
                                                        win: false,
                                                        enemy: user 
                                                    });

                                                    gameResultLose
                                                        .save()
                                                        .then(result => {
                                                            //console.log(result);
                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });


                                                    user2.games.push(gameResultLose);
                                                    user2.save().then(result => {
                                                        //console.log(result);
                                                    });

                                                    user.games.push(gameResultWin);
                                                    user.save().then(result => {
                                                        //console.log(result);
                                                    });


                                                    console.log("VEGE A JATEKNAK")

                                                    io.emit('rooms-available', {
                                                        'totalRoomCount': totalRoomCount,
                                                        'fullRooms': fullRooms,
                                                        'emptyRooms': emptyRooms
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


                            let fullRoomsPos = fullRooms.indexOf(roomName);
                            if (fullRoomsPos > -1) {
                                fullRooms.splice(fullRoomsPos, 1);
                                totalRoomCount--;
                            }


                            redisDB.set("totalRoomCount", totalRoomCount);
                            redisDB.set("usersInGame", JSON.stringify({
                                users: usersInGame,
                                usersName: usersInGameUsername
                            }));
                            redisDB.set("allRooms", JSON.stringify({
                                emptyRooms: emptyRooms,
                                fullRooms: fullRooms
                            }));

                            redisDB.set('games', JSON.stringify({
                                games: games
                            }));


                            io.sockets.in("room-" + roomName).emit('receive-move', {
                                'whoseTurn': null,
                                'whichGrid': whichGrid
                            });

                            io.sockets.in("room-" + roomName).emit('game-end', {
                                'draw': false,
                                'winner': whoseMove
                            });
                        }
                    });

                    if (jatek.gameState.length >= 9) {

                        end_game = true;

                        User.findOne({ username: whoseMove })
                            .exec()
                            .then(user => {
                                if (!user) {
                                    console.log("nincs is ilyen user, lol");
                                } else {
                                    console.log('elso user:');
                                    console.log(games);
                                    User.findOne({ username: whoIsNext })
                                        .exec()
                                        .then(user2 => {
                                            if (!user2) {
                                                console.log("nincs is ilyen user, lol");
                                            } else {



                                                const gameResultDraw1 = new GameResult({
                                                    draw: true,
                                                    win: false,
                                                    enemy: whoIsNext

                                                });

                                                gameResultDraw1
                                                    .save()
                                                    .then(result => {
                                                        //console.log(result);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });

                                                user.games.push(gameResultDraw1);
                                                user.save().then(result => {
                                                    //console.log(result);
                                                });






                                                const gameResultDraw2 = new GameResult({
                                                    draw: true,
                                                    win: false,
                                                    enemy: whoseMove
                                                });

                                                gameResultDraw2
                                                    .save()
                                                    .then(result => {
                                                        //console.log(result);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });


                                                user2.games.push(gameResultDraw2);
                                                user2.save().then(result => {
                                                    //console.log(result);
                                                });

                                                //console.log('masodik user:');
                                                //console.log(games);
                                                const gameResultWin = new GameResult({
                                                    draw: false,
                                                    win: true,
                                                    enemy: user2
                                                });

                                                gameResultWin
                                                    .save()
                                                    .then(result => {
                                                        // console.log(result);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });

                                                const gameResultLose = new GameResult({
                                                    draw: false,
                                                    win: false,
                                                    enemy: user
                                                });

                                                gameResultLose
                                                    .save()
                                                    .then(result => {
                                                        //console.log(result);
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                    });


                                                user2.games.push(gameResultLose);
                                                user2.save().then(result => {
                                                    //console.log(result);
                                                });

                                                user.games.push(gameResultWin);
                                                user.save().then(result => {
                                                    //console.log(result);
                                                });

                                                console.log("VEGE A JATEKNAK")

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

                        // erre van szukseg? hogy socket.id-t is mentsunk. vagy mas strukturaja legyen?
                        let usersInGamePos = usersInGame.indexOf(socket.id);
                        if (usersInGamePos > -1) {
                            usersInGame.splice(usersInGamePos, 1);
                        }

                        let usersInGameUsernamePos = usersInGameUsername.indexOf(whoseMove);
                        if (usersInGameUsernamePos > -1) {
                            usersInGameUsername.splice(usersInGameUsernamePos, 1);
                        }

                        let usersInGameUsernamePos2 = usersInGameUsername.indexOf(whoIsNext);
                        if (usersInGameUsernamePos2 > -1) {
                            usersInGameUsername.splice(usersInGameUsernamePos2, 1);
                        }

                        let fullRoomsPos = fullRooms.indexOf(roomName);
                        if (fullRoomsPos > -1) {
                            fullRooms.splice(fullRoomsPos, 1);
                            totalRoomCount--;
                        }


                        redisDB.set("totalRoomCount", totalRoomCount);
                        redisDB.set("usersInGame", JSON.stringify({
                            users: usersInGame,
                            usersName: usersInGameUsername
                        }));
                        redisDB.set("allRooms", JSON.stringify({
                            emptyRooms: emptyRooms,
                            fullRooms: fullRooms
                        }));

                        redisDB.set('games', JSON.stringify({
                            games: games
                        }));

                        io.sockets.in("room-" + roomName).emit('receive-move', {
                            'whoseTurn': null,
                            'whichGrid': whichGrid
                        });

                        io.sockets.in("room-" + roomName).emit('game-end', {
                            'draw': true,
                            'winner': null
                        });
                    } else {
                        if (!end_game) {
                            games.push(jatek);
                            redisDB.set('games', JSON.stringify({
                                games: games
                            }));

                            io.sockets.in("room-" + roomName).emit('receive-move', {
                                'whoseTurn': whoIsNext,
                                'whichGrid': whichGrid
                            });
                        }
                    }
                }
            }
        }
    });
};

