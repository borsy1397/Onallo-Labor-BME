const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');
const bodyParser = require('body-parser');



const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// io.on('connection', function (socket) {
//     console.log('a user connected');
// });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error!");
});


require('./routes/user')(app);
require('./routes/general')(app);



const port = 3000;
http.listen(port, () => {
    console.log(`Listening... Port: ${port}`);
});