const GameResult = require('../../models/GameResult');
const User = require('../../models/User');


module.exports = (io, socket, redisDB) => {

    // Megnezni, hogy ha a socket megszunik, torolni kell e a roomot, amiben volt
    // Szerintem nem, sot... szinte biztos, de rakeresni (Should i delete room when socket disconnected)

    //console.log('User disconnected');
    //console.log('Disconnectingnel! Socket.rooms: ' + rooms);
    const rooms = Object.keys(socket.rooms);
    const roomName = (rooms[1] !== undefined && rooms[1] !== null) ? (rooms[1]).split('-')[1] : null;
    if (roomName !== null) {
        Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
            let totalRoomCount = values[0];
            let usersInGame = JSON.parse(values[1])['users'];
            let usersInGameUsername = JSON.parse(values[1])['usersName'];
            let fullRooms = JSON.parse(values[2])['fullRooms'];
            let emptyRooms = JSON.parse(values[2])['emptyRooms'];
            let games = JSON.parse(values[3])['games'];
            
            for (gameIndex = 0; gameIndex < games.length; gameIndex++) {
                if (games[gameIndex].id === roomName) {
                    console.log(games);
                    console.log('-----------Disconnecting')
                    const winner = games[gameIndex].users[0] == socket.username ? games[gameIndex].users[1] : games[gameIndex].users[0]
                    games.splice(gameIndex, 1);
                    console.log(games);

                    


                    User.findOne({ username: winner })
                    .exec()
                    .then(user => {
                        if (!user) {
                            console.log("nincs is ilyen user, lol");
                        } else {
                            console.log('elso user:');
                            console.log(games);
                            User.findOne({ username: socket.username })
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
                    
                    
                    io.sockets.in("room-" + roomName).emit('room-disconnect', { id: socket.id });
                    io.emit('rooms-available', {
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms
                    });
                    break;
                }
            }       
            
            let usersInGamePos = usersInGame.indexOf(socket.id);
            if (usersInGamePos > -1) {
                usersInGame.splice(usersInGamePos, 1);
            }
            
            let usersInGameUsernamePos = usersInGameUsername.indexOf(socket.username);
            if (usersInGameUsernamePos > -1) {
                usersInGameUsername.splice(usersInGameUsernamePos, 1);
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
            
            
            // console.log('Disconnection........ SocketID:' + socket.id);
            // console.log('Jatekban levok: ' + usersInGame);
        });
    }
};