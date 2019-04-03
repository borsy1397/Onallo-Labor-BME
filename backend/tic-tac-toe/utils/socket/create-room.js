module.exports = (io, socket, redisDB, data) => {
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
}