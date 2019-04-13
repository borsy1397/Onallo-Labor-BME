module.exports = (io, redisDB) => {

    io.on('connection', socket => {
        console.log("Connected...... " + socket.id);
        /**
         * Szoval: tokent majd itt kell vizsgalni, hogy ervenyes e: jwt.verify()....
         */
    
        socket.on('create-room', data => {
            require('./create-room')(io, socket, redisDB, data);
        });
    
        socket.on('join-room', data => {
            require('./join-room')(io, socket, redisDB, data);
        });
    
        socket.on('send-message', data => {
            require('./send-message')(io, socket, data);
        });
    
        socket.on('send-move', move => {
            require('./send-move')(io, socket, redisDB, move);
        });
    
        socket.on('disconnecting', () => {
            require('./disconnecting')(io, socket, redisDB);
        });
    });
};

            // io.sockets.emit --> This will emit the event to ALL the connected clients
            // (event the socket that might have fired this event).
            // pl: io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});

            // if we want to send an event to everyone, but the client that caused it, we can use the socket.broadcast.emit.


            // One thing to keep in mind while using rooms is that they can only be joined on the server side.
            // https://www.tutorialspoint.com/socket.io/socket.io_rooms.htm

            // Message − When the server sends a message using the send function.

            // DEBUG=* node app.js
            // localStorage.debug = 'socket.io-client:socket';

            // io.emit --> broadcast mindenkinek
            // socket.emit --> csak a socketnek broadcast - a socketnel csinal emitet

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
