const jwt = require('jsonwebtoken');
const secretKeys = require('../secret').secretKeys;

module.exports = (io, redisDB) => {
    io.use(authorizeSocket).on('connection', socket => {

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

function authorizeSocket(socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, secretKeys.tokenSecret, (err, decoded) => {
            if (err) {
                console.log('Socket authentication error1');
                return next(new Error('Authentication error'));
            }

            socket.decodedUsername = decoded.username;
            console.log('Authentication is successful in token!')
            next();
        });
    } else {
        console.log('Socket authentication error2');
        next(new Error('Authentication error'));
    }
};