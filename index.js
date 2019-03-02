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