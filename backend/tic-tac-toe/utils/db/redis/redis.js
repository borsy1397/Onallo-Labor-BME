const redis = require('redis');
const bluebird = require('bluebird');

const redisClient = redis.createClient();
bluebird.promisifyAll(redisClient);

redisClient.set("totalRoomCount", 0);

redisClient.set("usersInGame", JSON.stringify({
    users: [], 
    usersName: []
}));

redisClient.set("allRooms", JSON.stringify({
    emptyRooms: [],
    fullRooms: []
}));

redisClient.set("games", JSON.stringify({
    games: []
}));

module.exports = redisClient;