module.exports = redisDB => {
    return (req, res, next) => {
        Promise.all(['totalRoomCount', 'allRooms', 'usersInGame'].map(key => redisDB.getAsync(key))).then(values => {
            const totalRoomCount = values[0];
            const allRooms = JSON.parse(values[1]);
            const usersInGame = JSON.parse(values[2])['users'];
            res.status(200).json({
                'totalRoomCount': totalRoomCount,
                'fullRooms': allRooms['fullRooms'],
                'emptyRooms': allRooms['emptyRooms'],
                'usersInGame': usersInGame.length
            });
        });
    };
}