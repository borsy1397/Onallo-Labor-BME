module.exports = (user) => {
    return {
        username: user.username,
        points: user.points,
        id: user._id
    }
}