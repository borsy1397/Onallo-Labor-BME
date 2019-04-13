module.exports = (io, socket, redisDB) => {
    //console.log('User disconnected');
    //console.log('Disconnectingnel! Socket.rooms: ' + rooms);
    const rooms = Object.keys(socket.rooms);
    const roomName = (rooms[1] !== undefined && rooms[1] !== null) ? (rooms[1]).split('-')[1] : null;
    if (roomName !== null) {
        Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
            let totalRoomCount = values[0];
            let usersInGame = JSON.parse(values[1])['users'];
            let fullRooms = JSON.parse(values[2])['fullRooms'];
            let emptyRooms = JSON.parse(values[2])['emptyRooms'];
            let games = JSON.parse(values[3])['games'];

            for (gameIndex = 0; gameIndex < games.length; gameIndex++) {
                if (games[gameIndex].id === roomName) {
                    games.splice(gameIndex, 1);
                    break;
                }
            }

            // ha valaki kilep, akkor a gameresultot itt kell kezelni!!!!!

            
            let usersInGamePos = usersInGame.indexOf(socket.id);
            if (usersInGamePos > -1) {
                usersInGame.splice(usersInGamePos, 1);
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
                users: usersInGame
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
            // ha ures lesz a room, vagy az utolso jatekos is disconnectel, akkor torolni a roomot!!
            // ezt a rooms-availablet osszehangolni a send-movenal, hogy ha vege a jateknak, akkor csinaljuk ezt ott?
            // vagy itt? vagy ha mar ott csinaljuk, itt mar nem kell?
            io.sockets.in("room-" + roomName).emit('room-disconnect', { id: socket.id });
            io.emit('rooms-available', {
                'totalRoomCount': totalRoomCount,
                'fullRooms': fullRooms,
                'emptyRooms': emptyRooms
            });
            
        });
    }
};