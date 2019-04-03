module.exports = (io, socket, redisDB, data) => {
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
};