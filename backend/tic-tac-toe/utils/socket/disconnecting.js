const GameResult = require('../../models/GameResult');
const User = require('../../models/User');

module.exports = (io, socket, redisDB) => {
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
                    const winner = games[gameIndex].users[0] == socket.decodedUsername ? games[gameIndex].users[1] : games[gameIndex].users[0]
                    let indexx = games[gameIndex].users[0] === winner ? 0 : 1;
                    let jatek = games[gameIndex];
                    let playtime = Math.ceil((Date.now() - games[gameIndex].created) / 1000);
                    games.splice(gameIndex, 1);

                    User.findOne({ username: winner })
                    .exec()
                    .then(user => {
                        if (!user) {
                        } else {
                            User.findOne({ username: socket.decodedUsername })
                                .exec()
                                .then(user2 => {
                                    if (!user2) {
                                    } else {

                                        const gameResultWin = new GameResult({
                                            draw: false,
                                            win: true,
                                            enemy: user2,
                                            shape: jatek.type[indexx === 0 ? 0 : 1],
                                            playTime: playtime
                                        });

                                        gameResultWin
                                            .save()
                                            .then(result => {
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });

                                        const gameResultLose = new GameResult({
                                            draw: false,
                                            win: false,
                                            enemy: user,
                                            shape: jatek.type[indexx === 0 ? 1 : 0],
                                            playTime: playtime
                                        });

                                        gameResultLose
                                            .save()
                                            .then(result => {
                                            })
                                            .catch(err => {
                                                console.log(err);
                                            });

                                        user2.games.unshift(gameResultLose);
                                        user2.save().then(result => {
                                        });

                                        user.points += 2;
                                        user.games.unshift(gameResultWin);
                                        user.save().then(result => {
                                        });
                                        //ide nem kell room-disconnect? vagy pont hogy jo, hogy nincs, es a tobbihez sem kell?
                                        io.emit('rooms-available', {
                                            'totalRoomCount': totalRoomCount,
                                            'emptyRooms': emptyRooms,
                                            'usersInGame': usersInGame.length
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
                    
                    
                    io.sockets.in("room-" + roomName).emit('room-disconnect');
                    io.emit('rooms-available', {
                        'totalRoomCount': totalRoomCount,
                        'emptyRooms': emptyRooms,
                        'usersInGame': usersInGame.length
                    });
                    break;
                }
            }       
            
            let usersInGamePos = usersInGame.indexOf(socket.id);
            if (usersInGamePos > -1) {
                usersInGame.splice(usersInGamePos, 1);
            }
            
            let usersInGameUsernamePos = usersInGameUsername.indexOf(socket.decodedUsername);
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

            io.sockets.in("room-" + roomName).emit('room-disconnect');
            io.emit('rooms-available', {
                'totalRoomCount': totalRoomCount,
                'emptyRooms': emptyRooms,
                'usersInGame': usersInGame.length
            });

        });
    }
};