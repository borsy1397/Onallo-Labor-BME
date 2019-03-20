const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');
const bodyParser = require('body-parser');
//const bluebird = require('bluebird');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error!");
});

require('./routes/game')(app);
require('./routes/user')(app);
require('./routes/general')(app);



/*const redis = require('redis');
const redisDB = redis.createClient();
bluebird.promisifyAll(redisDB);

redisDB.set("totalRoomCount", 0);
redisDB.set("usersInGame", JSON.stringify({
    users: []
    // ide lehet majd olyat, hogy aki online, kapcsolodott, de meg nem jatszik jatekban?
}));
redisDB.set("allRooms", JSON.stringify({
    emptyRooms: [],
    fullRooms: []
}));*/


// de ezt az egeszet nem lehetne abba rakni, hogy amikor kapcsolodik, megkapja???
app.get('/getGames', (request,response) => {
    Promise.all(['totalRoomCount','allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        const totalRoomCount = values[0];
        const allRooms = JSON.parse(values[1]);
        response.status(200).json({
            'totalRoomCount' : totalRoomCount,
            'fullRooms' : allRooms['fullRooms'],
            'emptyRooms': allRooms['emptyRooms']
        });
    });
});		




io.on('connection', socket => {
    console.log("Connected......s..");

    Promise.all(['totalRoomCount', 'usersInGame', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        let usersInGame = JSON.parse(values[1])['users'];
        console.log(usersInGame);
    });
    /**
     * Szoval: tokent majd itt kell vizsgalni, hogy ervenyes e: jwt.verify()....
     */

    socket.on('create-room', data => {
        //databan at kellene adni majd a usernamet
        Promise.all(['totalRoomCount', 'usersInGame', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
            const allRooms = JSON.parse(values[2]);
            let usersInGame = JSON.parse(values[1])['users'];
            let totalRoomCount = values[0];
            let fullRooms = allRooms['fullRooms'];
            let emptyRooms = allRooms['emptyRooms'];

            // majd azt kell megcsinalni, hogy ne a totalRoomCount legyen, hanem pl. a username legyen az azonosito

            const _userInGame = usersInGame.includes(socket.id);

            if (!_userInGame) {
                let isIncludes = emptyRooms.includes(totalRoomCount);
                if (!isIncludes) {
                    totalRoomCount++;
                    emptyRooms.push(totalRoomCount);
                    socket.join("room-" + totalRoomCount);
                    redisDB.set("totalRoomCount", totalRoomCount);
                    redisDB.set("allRooms", JSON.stringify({
                        emptyRooms: emptyRooms,
                        fullRooms: fullRooms
                    }));

                    usersInGame.push(socket.id);
                    redisDB.set("usersInGame", JSON.stringify({
                        users: usersInGame
                    }));

                    console.log('Create room! Jelenleg jatekban levok ' + usersInGame);

                    // Ha uj jatekot csinalnak, akkor emitelni kell, hogy uj jatek jott letre 
                    io.emit('rooms-available', {
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms
                    });

                    io.sockets.in("room-" + totalRoomCount).emit('new-room', {
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms,
                        'roomNumber': totalRoomCount
                    });
                }
            }



            // Rooms in Socket.IO don't need to be created, one is created when a socket joins it. 
            // // They are joined on the server side, so you would have to instruct the server using the client. // //

            /**
             * socket.on('create', function (room) {
                socket.join(room);
                });

                In the example above, a room is created with a name specified in variable room.
                You don't need to store this room object anywhere, because it's already part of the io object.
                You can then treat the room like its own socket instance.
                io.sockets.in(room).emit('event', data);
             */

            // io.sockets.emit --> This will emit the event to ALL the connected clients
            // (event the socket that might have fired this event).
            // pl: io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

            // f we want to send an event to everyone, but the client that caused it, we can use the socket.broadcast.emit.


            // One thing to keep in mind while using rooms is that they can only be joined on the server side.
            // https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm

            // Message − When the server sends a message using the send function.

            // DEBUG=* node app.js
            // localStorage.debug = 'socket.io-client:socket';

            /**
             * 
             * Each Socket in Socket.IO is identified by a random, unguessable, unique identifier Socket#id.
             * For your convenience, each socket automatically joins a room identified by this id.
               This makes it easy to broadcast messages to other sockets:
             */

            // https://socket.io/docs/emit-cheatsheet/

            /**
             * 
             * io.sockets.emit('hi', 'everyone');
              // is equivalent to
              io.of('/').emit('hi', 'everyone');

             */

            // A Socket is the fundamental class for interacting with browser clients.
            //A Socket belongs to a certain Namespace (by default /) and uses an underlying Client to communicate.

            // A socketnel is vannak middlewarek!! authentication
            // Registers a middleware, which is a function that gets executed for
            // every incoming Packet and receives as parameter the packet
            // and a function to optionally defer execution to the next registered middleware.
            // https://socket.io/docs/server-api/#socket-use-fn

            /**
             * The mechanics of joining rooms are handled by the Adapter that has been configured
             * (see Server#adapter above), defaulting to socket.io-adapter.

             For your convenience, each socket automatically joins a room identified by its id (see Socket#id).
             This makes it easy to broadcast messages to other sockets:
                 https://socket.io/docs/server-api/#socket-join-room-callback                
             */

            // ITT a TOKENES MIDDLEWARES CUCC: https://socket.io/docs/client-api/#With-query-parameters


            //stackoverflow: io.sockets.sockets[yourSocketID].rooms equals socket.rooms
        });
    });

    socket.on('join-room', data => {

        //Szerveroldalon kezelni, hogy kie a kovetkezo lepes
        const roomNumber = data.roomNumber;
        Promise.all(['totalRoomCount', 'usersInGame', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
            const allRooms = JSON.parse(values[2]);
            let usersInGame = JSON.parse(values[1])['users'];
            let totalRoomCount = values[0];
            let fullRooms = allRooms['fullRooms'];
            let emptyRooms = allRooms['emptyRooms'];

            const _userInGame = usersInGame.includes(socket.id);

            if (!_userInGame) {
                let indexPos = emptyRooms.indexOf(roomNumber);
                if (indexPos > -1) {
                    emptyRooms.splice(indexPos, 1);
                    fullRooms.push(roomNumber);

                    usersInGame.push(socket.id);
                    console.log('Join room! Jelenleg jatekban levok: ' + usersInGame);
                    redisDB.set("usersInGame", JSON.stringify({
                        users: usersInGame
                    }));

                    console.log('Create room! Jelenleg jatekban levok ' + usersInGame);

                    /* User Joining socket room */
                    socket.join("room-" + roomNumber);
                    redisDB.set("allRooms", JSON.stringify({
                        emptyRooms: emptyRooms,
                        fullRooms: fullRooms
                    }));

                    /* Getting the room number from socket */
                    // Most ez tenyleg kell? felesleges szerintem
                    const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
                    io.emit('rooms-available', {
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms
                    });


                    io.sockets.in("room-" + roomNumber).emit('start-game', {
                        'ellenfel': data.username,
                        'totalRoomCount': totalRoomCount,
                        'fullRooms': fullRooms,
                        'emptyRooms': emptyRooms,
                        'roomNumber': currentRoom
                    });
                }
            }
        });
    });

    socket.on('disconnecting', () => {
        console.log('User disconnected');
        const rooms = Object.keys(socket.rooms);
        console.log('Disconnectingnel! Socket.rooms: ' + rooms);
        const roomNumber = (rooms[1] !== undefined && rooms[1] !== null) ? (rooms[1]).split('-')[1] : null;
        if (rooms !== null) {
            Promise.all(['totalRoomCount', 'usersInGame', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
                const allRooms = JSON.parse(values[2]);
                let usersInGame = JSON.parse(values[1])['users'];
                let totalRoomCount = values[0];
                let fullRooms = allRooms['fullRooms'];
                let emptyRooms = allRooms['emptyRooms'];

                let usersInGamePos = usersInGame.indexOf(parseInt(socket.id));
                usersInGame.splice(usersInGamePos, 1);
                redisDB.set("usersInGame", JSON.stringify({
                    users: usersInGame
                }));

                /**
                 * 
                 * TOROLNI A JATEKOT!!!! totalroomcountnal n
                 * EMITELNI elkuldeni a total room countot
                 * 
                 * todo: page refreshnel felismerni, hogy ez ugyanaz
                 * 
                 */

                let fullRoomsPos = fullRooms.indexOf(parseInt(roomNumber));
                if (fullRoomsPos > -1) {
                    fullRooms.splice(fullRoomsPos, 1);


                }
                if (totalRoomCount > 0) {
                    totalRoomCount--;
                } else {
                    totalRoomCount = 1;
                }
                redisDB.set("totalRoomCount", totalRoomCount);
                redisDB.set("allRooms", JSON.stringify({
                    emptyRooms: emptyRooms,
                    fullRooms: fullRooms
                }));
                console.log('Disconnection........ SocketID:' + socket.id);
                console.log('Jatekban levok: ' + usersInGame);
                io.sockets.in("room-" + roomNumber).emit('room-disconnect', { id: socket.id });
            });
        }
    });

    /**
     * 
     * io.emit --> broadcast mindenkinek
     * socket.emit --> csak a socketnek broadcast - a socketnel csinal emitet
     * 
     * createGame
     * joinGame
     * move
     * 
     * sendMessage
     * 
     * disconnect
     * 
     * 
     * 
     * 
     * 
     * 
     */
});




const port = 3000;
http.listen(port, () => {
    console.log(`Listening... Port: ${port}`);
});