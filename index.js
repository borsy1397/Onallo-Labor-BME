const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');


const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res, next) => {
    res.send('Tic-Tac-Toe Game');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error!");
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening... Port: ${port}`);
});