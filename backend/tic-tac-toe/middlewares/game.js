module.exports.getGamesMW = (req, res, next) => {

    /**
     * 
     * 
     * 
     * 
     * 
     * 
     * Megcsinalni, hogy mukodokepes legyen
     * az authentikacioval majd kesobb foglalkozni
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */
    //const io = req.io;

    let socket_id = [];
    const io = req.app.get('socketio');
 
    io.on('connection', socket => {
        console.log("pls irj ki valamit");
       socket_id.push(socket.id);
       if (socket_id[0] === socket.id) {
         // remove the connection listener for any subsequent 
         // connections with the same ID
         io.removeAllListeners('connection'); 
       }
 
       socket.on('hello message', msg => {
         console.log('just got: ', msg);
         socket.emit('chat message', 'hi from server');
 
       })
 
    });

};