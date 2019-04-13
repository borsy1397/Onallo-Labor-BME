module.exports = (io, socket, redisDB, data) => {

    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms']
        .map(key => redisDB.getAsync(key)))
        .then(values => {
            let totalRoomCount = values[0];
            let usersInGame = JSON.parse(values[1])['users'];
            let usersInGameUsername = JSON.parse(values[1])['usersName'];
            let fullRooms = JSON.parse(values[2])['fullRooms'];
            let emptyRooms = JSON.parse(values[2])['emptyRooms'];

            const _userInGame = usersInGame.includes(socket.id) || usersInGame.includes(data.username)
                                emptyRooms.includes(data.username) || fullRooms.includes(data.username);
            if (!_userInGame) {

                socket.username = data.username;

                totalRoomCount++;
                emptyRooms.push(data.username);
                usersInGame.push(socket.id);

                redisDB.set("totalRoomCount", totalRoomCount);
                redisDB.set("allRooms", JSON.stringify({
                    emptyRooms: emptyRooms,
                    fullRooms: fullRooms
                }));
                redisDB.set("usersInGame", JSON.stringify({
                    users: usersInGame
                }));

                // console.log('Create room! Jelenleg jatekban levok ' + usersInGame);

                socket.join("room-" + data.username);

                io.emit('rooms-available', {
                    'totalRoomCount': totalRoomCount,
                    'fullRooms': fullRooms,
                    'emptyRooms': emptyRooms
                });

                // Ezek igazabol nem is kellenek, csak hogy emitteljunk, az a lenyeg
                io.sockets.in("room-" + data.username).emit('new-room', {});

            }
        });
}