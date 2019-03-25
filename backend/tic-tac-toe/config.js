const mongoose = require('mongoose');
const key = require('./assets/secret').secretKeys;

/*mongoose.connect(`mongodb+srv://ahhwwyeeaa:${key.mongoDBPass}@tic-tac-toe-5bmvk.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true,
    useCreateIndex: true
});*/

mongoose.connect('mongodb://localhost/tictactoe', {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports.mongoose = mongoose;