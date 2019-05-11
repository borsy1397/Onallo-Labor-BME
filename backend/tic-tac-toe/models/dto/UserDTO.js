module.exports = (user, ownProfile) => {
    if(!ownProfile) {
        user.email = "";    
    }

    let gamesDTO = [];
    let win = 0;
    let draw = 0;
    let lost = 0;

    user.games.forEach(game => {
        if(game.draw) {
            draw++;
        } else {
            if(game.win) {
                win++;
            } else {
                lost++;
            }
        }
        gamesDTO.push(GameDTO(game));
    })
    
    return {
        username: user.username,
        email: user.email,
        games: gamesDTO, 
        joined: user.joined,
        points: user.points,
        win: win,
        draw: draw,
        lost: lost 
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