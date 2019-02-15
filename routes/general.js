module.exports = app => {
    
    app.get('/', (req, res, next) => {
        res.send('<h1>Tic-Tac-Toe Game</h1>');
    });

    app.post('/login', (req, res, next) => {

    });

    app.post('/logout', (req, res, next) => {

    });

    app.post('/signup', (req, res, next) => {

    });

}