module.exports = (io, socket, redisDB, data) => {
    const roomName = data.roomName;
    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
        let totalRoomCount = values[0];
        let usersInGame = JSON.parse(values[1])['users'];
        let fullRooms = JSON.parse(values[2])['fullRooms'];
        let emptyRooms = JSON.parse(values[2])['emptyRooms'];
        let games = JSON.parse(values[3])['games'];

        const _userInGame = usersInGame.includes(socket.id) || emptyRooms.includes(data.username) || fullRooms.includes(data.username);

        if (!_userInGame) {

            let indexPos = emptyRooms.indexOf(roomName);
            if (indexPos > -1) {
                
                //console.log('Join room! Jelenleg jatekban levok: ' + usersInGame);
                
                
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
                emptyRooms.splice(indexPos, 1);
                fullRooms.push(roomName);
                usersInGame.push(socket.id);
                
                
                redisDB.set("usersInGame", JSON.stringify({
                    users: usersInGame
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
                    'emptyRooms': emptyRooms
                });
                
                // itt kellene visszakuldeni, hogy milyen tipusu szart kell raknia? vagy majd hol?
                //const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
                
                io.sockets.in("room-" + roomName).emit('start-game', {
                    'ellenfel': data.username,
                    'roomName': roomName
                });
            }

        }
    });
};