module.exports = (user, ownProfile) => {
    if(!ownProfile) {
        user.email = "";    
    }

    let gamesDTO = [];

    user.games.forEach(game => {
        gamesDTO.push(GameDTO(game));
    })
    
    return {
        username: user.username,
        email: user.email,
        games: gamesDTO, 
        joined: user.joined,
        points: user.points
    }
}

function GameDTO(game) {
    return {
        draw: game.draw,
        playTime: game.playTime, 
        win: game.win,
        shape: game.shape,
        enemy: {
            id: game.enemy._id,
            username: game.enemy.username
        }
    }
}