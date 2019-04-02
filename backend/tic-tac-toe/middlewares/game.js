module.exports.getGames = function (redisDB) {

    return function (req, res, next) {
        Promise.all(['totalRoomCount', 'allRooms'].map(key => redisDB.getAsync(key))).then(values => {
            const totalRoomCount = values[0];
            const allRooms = JSON.parse(values[1]);
            res.status(200).json({
                'totalRoomCount': totalRoomCount,
                'fullRooms': allRooms['fullRooms'],
                'emptyRooms': allRooms['emptyRooms']
            });
        });
        //return next();
    };

};