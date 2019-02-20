const mongoose = require('mongoose');
const key = require('./assets/secret').secretKeys;

mongoose.connect(`mongodb+srv://ahhwwyeeaa:<${key.mongoDBPass}>@tic-tac-toe-5bmvk.mongodb.net/test?retryWrites=true`, {
    useNewUrlParser: true
});

module.export.mongoose = mongoose;