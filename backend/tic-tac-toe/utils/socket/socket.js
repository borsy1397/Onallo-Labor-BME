const jwt = require('jsonwebtoken');
const secretKeys = require('../../assets/secret').secretKeys;

module.exports = (io, redisDB) => {

    // DEBUG=* node app.js
    // localStorage.debug = 'socket.io-client:socket';

    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {

            jwt.verify(socket.handshake.query.token, secretKeys.tokenSecret, (err, decoded) => {
                if (err) {
                    console.log('Socket authentication error1');
                    return next(new Error('Authentication error'));
                }
                console.log(decoded);

                socket.decodedUsername = decoded.username;
                console.log('Authentication is successful in token!')
                next();
            });
        } else {
            console.log('Socket authentication error2');
            next(new Error('Authentication error'));
        }
    }).on('connection', socket => {
        console.log("Connected...... " + socket.id);

        // Itt lesz egy lenyeges resz, hogy a socket.username-t beallitani a token dekodolas altal.
        // Legalabbis erre szukseg lenne, hogy tudjuk, mi a username annak, akihez tartozik a socket.

        // Ez nem tokenes: ugye elmentjuk a socket.id-t, meg usernamet is, ezekre szukseg van mindkettore?


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