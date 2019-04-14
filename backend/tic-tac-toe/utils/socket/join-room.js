module.exports = (io, socket, redisDB, data) => {
    const roomName = data.roomName;
    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms', 'games'].map(key => redisDB.getAsync(key))).then(values => {
        let totalRoomCount = values[0];
        let usersInGame = JSON.parse(values[1])['users'];
        let usersInGameUsername = JSON.parse(values[1])['usersName'];
        let fullRooms = JSON.parse(values[2])['fullRooms'];
        let emptyRooms = JSON.parse(values[2])['emptyRooms'];
        let games = JSON.parse(values[3])['games'];

        const _userInGame = usersInGame.includes(socket.id) || usersInGameUsername.includes(data.username)
                            emptyRooms.includes(data.username) || fullRooms.includes(data.username);

        // ha nagyon biztonsagos legyen, akkor itt meg kellene keresni, hogy van e ilyen username az adatbazisban
        // es igy ki van vedve, hogy random usernamet rak bele
        // de olyan usernamet meg mindig megadhat, ami nem a sajatja, de letezik az adatbazisban.
        // VAGY! ugyis tokent fog kuldeni a user, es akkor a tokenben kodolva van a username!!!
        // na ez lesz a megoldas!
        // es akkor frontenden nem a localstoragebol kell kiolvasni.

        if (!_userInGame) {

            let indexPos = emptyRooms.indexOf(roomName);
            if (indexPos > -1) {
                
                //console.log('Join room! Jelenleg jatekban levok: ' + usersInGame);
                socket.username = data.username;
                
                const newGame = {
                    id: roomName,
                    whoseMove: roomName,
                    users: [roomName, data.username],
                    type: ['x', 'o'],
                    scores: [0, 0],
                    gameState: [],
                    created: Date.now
                }
                
                games.push(newGame);
                emptyRooms.splice(indexPos, 1);
                fullRooms.push(roomName);
                usersInGame.push(socket.id);
                usersInGameUsername.push(data.username);
                
                
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
                    'emptyRooms': emptyRooms
                });

                io.emit('goto-play', {

                });
                
                // itt kellene visszakuldeni, hogy milyen tipusu szart kell raknia? vagy majd hol?                
                io.sockets.in("room-" + roomName).emit('start-game', {
                    'ellenfel': data.username,
                    'roomName': roomName
                });
            }

        }
    });
};