module.exports = (io, socket, redisDB) => {
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

            // ha valaki kilep, akkor a gameresultot itt kell kezelni!!!!!

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
};