module.exports = (user, ownProfile) => {
    if(!ownProfile) {
        user.email = "";   
        user._id = "";
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
        let enemyId = null;
        let enemyUsername = null;
        if(game.enemy == null || game.enemy == undefined) {
            enemyId = "deleteduser";
            enemyUsername = "deleted user";
        } else {
            enemyId = game.enemy._id;
            enemyUsername = game.enemy.username;
        }
        gamesDTO.push(GameDTO(game, enemyId, enemyUsername));
    })
    
    return {
        id: user._id,
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

function GameDTO(game, enemyId, enemyUsername) {
    return {
        draw: game.draw,
        playTime: game.playTime, 
        win: game.win,
        shape: game.shape,
        enemy: {
            id: enemyId,
            username: enemyUsername
        }
    }
}