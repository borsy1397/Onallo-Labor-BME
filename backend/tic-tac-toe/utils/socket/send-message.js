module.exports = (io, socket, data) => {
    const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    io.sockets.in("room-" + currentRoom).emit('receive-message', {
        'uzenet': data.message,
        'kuldo': socket.decodedUsername
    });
};