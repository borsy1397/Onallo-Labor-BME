module.exports = (io, socket, data) => {
    console.log(data);
    // ez itt full felesleges, hiszen csak a username-t kell beirni - roomName
    const currentRoom = (Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item != socket.id)[0]).split('-')[1];
    io.sockets.in("room-" + currentRoom).emit('receive-message', {
        'uzenet': data.message,
        //'kinek': data.to
        'kuldo': data.from
    });
};