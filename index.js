const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger_v1.json');


const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error!");
});

require('./routes/general')(app);
require('./routes/user')(app);


const port = 3000;
app.listen(port, () => {
    console.log(`Listening... Port: ${port}`);
});