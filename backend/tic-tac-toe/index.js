const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');
const bodyParser = require('body-parser');
const bluebird = require('bluebird');

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


const redis = require('redis');
const redisDB = redis.createClient();
bluebird.promisifyAll(redisDB);

redisDB.on("ready", (err) => {
    console.log("Ready ");
});




io.on('connection', socket => {
    console.log("Connected........");


    redisDB.flushdb();
   Promise.all(['totalRoomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
        const allRooms = JSON.parse(values[1]);
        let totalRoomCount = values[0];
        console.log(allRooms);
        console.log("---------------");
        console.log(totalRoomCount);
    });


    socket.on('create-room', data => {
        console.log(data);
    }); 

    socket.on('join-room', data => {

    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
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