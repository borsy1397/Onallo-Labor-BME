const GameResult = require('../models/GameResult');

module.exports = (io, redisDB) => {

    io.on('connection', socket => {
        console.log("Connected...... " + socket.id);  
        /**
         * Szoval: tokent majd itt kell vizsgalni, hogy ervenyes e: jwt.verify()....
         */
    
        socket.on('create-room', data => {
            Promise.all(['totalRoomCount', 'usersInGame', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
                const allRooms = JSON.parse(values[2]);
                let usersInGame = JSON.parse(values[1])['users'];
                let totalRoomCount = values[0];
                let fullRooms = allRooms['fullRooms'];
                let emptyRooms = allRooms['emptyRooms'];
    
                const _userInGame = usersInGame.includes(socket.id);
                console.log(_userInGame);
    
                if (!_userInGame) {
                    let isIncludes = emptyRooms.includes(data.username) || fullRooms.includes(data.username);
                    if (!isIncludes) {
                        totalRoomCount++;
    
                        emptyRooms.push(data.username);
    
                        socket.join("room-" + data.username);
    
                        usersInGame.push(socket.id);
    
                        redisDB.set("totalRoomCount", totalRoomCount);
                        redisDB.set("allRooms", JSON.stringify({
                            emptyRooms: emptyRooms,
                            fullRooms: fullRooms
                        }));
                        redisDB.set("usersInGame", JSON.stringify({
                            users: usersInGame
                        }));
    
                        console.log('Create room! Jelenleg jatekban levok ' + usersInGame);
    
                        io.emit('rooms-available', {
                            'totalRoomCount': totalRoomCount,
                            'fullRooms': fullRooms,
                            'emptyRooms': emptyRooms
                        });
    
                        io.sockets.in("room-" + data.username).emit('new-room', {
                            'roomName': data.username,
                            'totalRoomCount': totalRoomCount,
                            'fullRooms': fullRooms,
                            'emptyRooms': emptyRooms,
                        });
                    }
                }
            });
        });
    
        socket.on('join-room', data => {
            const roomName = data.roomName;
            Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
                const allRooms = JSON.parse(values[2]);
                let usersInGame = JSON.parse(values[1])['users'];
                let totalRoomCount = values[0];
                let fullRooms = allRooms['fullRooms'];
                let emptyRooms = allRooms['emptyRooms'];
                let games = JSON.parse(values[3])['games'];
    
                const _userInGame = usersInGame.includes(socket.id);
    
                if (!_userInGame) {
                    let isIncludes = emptyRooms.includes(data.username) || fullRooms.includes(data.username);
                    if (!isIncludes) {
                        let indexPos = emptyRooms.indexOf(roomName);
                        if (indexPos > -1) {
                            emptyRooms.splice(indexPos, 1);
                            fullRooms.push(roomName);
        
                            usersInGame.push(socket.id);
                            console.log('Join room! Jelenleg jatekban levok: ' + usersInGame);
                            redisDB.set("usersInGame", JSON.stringify({
                                users: usersInGame
                            }));
        
                            socket.join("room-" + roomName);
                            redisDB.set("allRooms", JSON.stringify({
                                emptyRooms: emptyRooms,
                                fullRooms: fullRooms
                            }));
    
                            // ide majd egy createdDatet lehet kellene, illetve azt is felvenni, hogy ki kezdte a jatekot.
                            const newGame = {
                                id: roomName,
                                whoseMove: roomName,
                                users: [roomName, data.username],
                                type: ['x', 'o'],
                                scores: [0, 0],
                                gameState: []
                            }
    
                            games.push(newGame);
    
                            redisDB.set("games", JSON.stringify({
                                games: games
                            }));
        
                            /* Getting the room name from socket */
                            const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
                            io.emit('rooms-available', {
                                'totalRoomCount': totalRoomCount,
                                'fullRooms': fullRooms,
                                'emptyRooms': emptyRooms
                            });
    
                            // itt kellene visszakuldeni, hogy milyen tipusu szart kell raknia? vagy majd hol?
        
                            io.sockets.in("room-" + roomName).emit('start-game', {
                                'ellenfel': data.username,
                                'totalRoomCount': totalRoomCount,
                                'fullRooms': fullRooms,
                                'emptyRooms': emptyRooms,
                                'roomName': currentRoom
                            });
                        }
                    }
                }
            });
        });
    
    
    
        socket.on('send-message', data => {
            console.log(data);
            // ez itt full felesleges, hiszen csak a username-t kell beirni - roomName
            const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
            io.sockets.in("room-" + currentRoom).emit('receive-message', {
                'uzenet': data.message,
                //'kinek': data.to
                'kuldo': data.from
            });
        });
    
        socket.on('send-move', move => {
    
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
    
                for(i = 0; i < games.length; i++) {
                    if(games[i].id == roomName) {
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
                                    // JATEK VEGE!!!!
                                    // kiszedni a games-bol az aktualis jatekot, illetve a full roomsbol, meg a usersInGamebol is
                                    // eltarolni mindket usernel a GameResultot
                                    
        
                                    //games.splice(gameIndex, 1);

                                    // DISCONNECTHEZ IS GAME RESULT

                                   /* const gameResultWin = new GameResult({
                                        //_id: new mongoose.Types.ObjectId(),
                                        draw: false,
                                        win: true,
                                        enemy: null // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
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
                                        enemy: null // Na ide kell majd megadni a usert. De ameddig nincs, addig stringkent taroljuk
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
                                                    */
                                        // A USERHEZ IS EL KELL MENTENI!!!!!! szoval le kell kerni a usereket
        
                                    
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
        });
    
        socket.on('disconnecting', () => {
            console.log('User disconnected');
            const rooms = Object.keys(socket.rooms);
            console.log('Disconnectingnel! Socket.rooms: ' + rooms);
            const roomName = (rooms[1] !== undefined && rooms[1] !== null) ? (rooms[1]).split('-')[1] : null;
            if (roomName !== null) {
                Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
                    const allRooms = JSON.parse(values[2]);
                    let usersInGame = JSON.parse(values[1])['users'];
                    let totalRoomCount = values[0];
                    let fullRooms = allRooms['fullRooms'];
                    let emptyRooms = allRooms['emptyRooms'];
                    const games = JSON.parse(values[3])['games'];
    
                    for (gameIndex = 0; gameIndex < games.length; gameIndex++) {
                        if (games[gameIndex].id === roomName) {
                            games.splice(gameIndex, 1);
                            break;
                        }
                    }
    
                    redisDB.set('games', JSON.stringify({
                        games: games
                    }));
    
                    let usersInGamePos = usersInGame.indexOf(socket.id);
                    console.log(usersInGamePos);
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
                    }
    
                    let emptyRoomsPos = emptyRooms.indexOf(roomName);
                    if (emptyRoomsPos > -1) {
                        emptyRooms.splice(emptyRoomsPos, 1);
                        totalRoomCount--;
                    }
    
                    redisDB.set("totalRoomCount", totalRoomCount);
                    redisDB.set("allRooms", JSON.stringify({
                        emptyRooms: emptyRooms,
                        fullRooms: fullRooms
                    }));
    
                    console.log('Disconnection........ SocketID:' + socket.id);
                    console.log('Jatekban levok: ' + usersInGame);
                    // ha ures lesz a room, vagy az utolso jatekos is disconnectel, akkor torolni a roomot!!
                    io.sockets.in("room-" + roomName).emit('room-disconnect', { id: socket.id });
                    io.emit('rooms-available', {
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms
                    });
                    // kiszedni a redisbeli games-bol a jatekot, ha a user disconnectel  
                });
            }
        });
    });
};




            // io.sockets.emit --> This will emit the event to ALL the connected clients
            // (event the socket that might have fired this event).
            // pl: io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

            // if we want to send an event to everyone, but the client that caused it, we can use the socket.broadcast.emit.


            // One thing to keep in mind while using rooms is that they can only be joined on the server side.
            // https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm

            // Message − When the server sends a message using the send function.

            // DEBUG=* node app.js
            // localStorage.debug = 'socket.io-client:socket';

            // io.emit --> broadcast mindenkinek
            // socket.emit --> csak a socketnek broadcast - a socketnel csinal emitet

            /**
             * 
             * Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id.
             * For your convenience, each socket automatically joins a room identified by this id.
               This makes it easy to broadcast messages to other sockets:
             */

            // https://socket.io/docs/emit-cheatsheet/

            /**
             * 
             * io.sockets.emit('hi', 'everyone');
              // is equivalent to
              io.of('/').emit('hi', 'everyone');
    
             */


            // A socketnel is vannak middlewarek!! authentication
            // Registers a middleware, which is a function that gets executed for
            // every incoming Packet and receives as parameter the packet
            // and a function to optionally defer execution to the next registered middleware.
            // https://socket.io/docs/server-api/#socket-use-fn

            /**
             * The mechanics of joining rooms are handled by the Adapter that has been configured
             * (see Server#adapter above), defaulting to socket.io-adapter.
    
             For your convenience, each socket automatically joins a room identified by its id (see Socket#id).
             This makes it easy to broadcast messages to other sockets:
                 https://socket.io/docs/server-api/#socket-join-room-callback                
             */

            // ITT a TOKENES MIDDLEWARES CUCC: https://socket.io/docs/client-api/#With-query-parameters


            //stackoverflow: io.sockets.sockets[yourSocketID].rooms equals socket.rooms
