const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tictactoe', {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports.mongoose = mongoose;