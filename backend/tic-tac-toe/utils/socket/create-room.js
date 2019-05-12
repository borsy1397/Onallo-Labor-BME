module.exports = (io, socket, redisDB, data) => {
    const username = socket.decodedUsername;

    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms']
        .map(key => redisDB.getAsync(key)))
        .then(values => {
            let totalRoomCount = values[0];
            let usersInGame = JSON.parse(values[1])['users'];
            let usersInGameUsername = JSON.parse(values[1])['usersName'];
            let fullRooms = JSON.parse(values[2])['fullRooms'];
            let emptyRooms = JSON.parse(values[2])['emptyRooms'];

            const _userInGame = usersInGame.includes(socket.id) || usersInGameUsername.includes(username)
                                emptyRooms.includes(username) || fullRooms.includes(username);
            if (!_userInGame) {

                totalRoomCount++;
                emptyRooms.push(username);
                usersInGame.push(socket.id);
                usersInGameUsername.push(username);

                redisDB.set("totalRoomCount", totalRoomCount);
                redisDB.set("allRooms", JSON.stringify({
                    emptyRooms: emptyRooms,
                    fullRooms: fullRooms
                }));
                redisDB.set("usersInGame", JSON.stringify({
                    users: usersInGame,
                    usersName: usersInGameUsername
                }));


                socket.join("room-" + username);

                io.emit('rooms-available', {
                    'totalRoomCount': totalRoomCount,
                    'fullRooms': fullRooms,
                    'emptyRooms': emptyRooms,
                    'usersInGame': usersInGame.length
                });
                
                io.sockets.in("room-" + username).emit('new-room', {});

            }
        });
}