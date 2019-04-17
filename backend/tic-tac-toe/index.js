const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redisDB = require('./utils/db/redis/redis');


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


require('./routes/user')(app);
require('./routes/general')(app);
require('./routes/game')(app, redisDB);
require('./utils/socket/socket')(io, redisDB);


const port = 3000;
http.listen(port, () => {
    console.log(`Listening... Port: ${port}`);
});
