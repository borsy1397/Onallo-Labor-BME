module.exports = (user, ownProfile) => {
    if(!ownProfile) {
        user.email = "";    
    }
    
    return {
        username: user.username,
        email: user.email,
        games: user.games, 
        joined: user.joined,
        points: user.points
    }
}