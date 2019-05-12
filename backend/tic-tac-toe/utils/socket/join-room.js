module.exports = (io, socket, redisDB, data) => {
    const username = socket.decodedUsername;
    const roomName = data.roomName;
    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
        let totalRoomCount = values[0];
        let usersInGame = JSON.parse(values[1])['users'];
        let usersInGameUsername = JSON.parse(values[1])['usersName'];
        let fullRooms = JSON.parse(values[2])['fullRooms'];
        let emptyRooms = JSON.parse(values[2])['emptyRooms'];
        let games = JSON.parse(values[3])['games'];

        const _userInGame = usersInGame.includes(socket.id) || usersInGameUsername.includes(username)
                            emptyRooms.includes(username) || fullRooms.includes(username);

        if (!_userInGame) {

            let indexPos = emptyRooms.indexOf(roomName);
            if (indexPos > -1) {

                
                const newGame = {
                    id: roomName,
                    whoseMove: roomName,
                    users: [roomName, username],
                    type: ['x', 'o'],
                    scores: [0, 0],
                    gameState: [],
                    created: Date.now()
                }
                
                games.push(newGame);
                emptyRooms.splice(indexPos, 1);
                fullRooms.push(roomName);
                usersInGame.push(socket.id);
                usersInGameUsername.push(username);
                
                
                redisDB.set("usersInGame", JSON.stringify({
                    users: usersInGame,
                    usersName: usersInGameUsername
                }));
                redisDB.set("allRooms", JSON.stringify({
                    emptyRooms: emptyRooms,
                    fullRooms: fullRooms
                }));
                redisDB.set("games", JSON.stringify({
                    games: games
                }));
                
                socket.join("room-" + roomName);
                
                io.emit('rooms-available', {
                    'totalRoomCount': totalRoomCount,
                    'fullRooms': fullRooms,
                    'emptyRooms': emptyRooms,
                    'usersInGame': usersInGame.length
                });

                io.emit('goto-play', {});
                               
                io.sockets.in("room-" + roomName).emit('start-game', {
                    'ellenfel': username,
                    'roomName': roomName
                });
            }

        }
    });
};