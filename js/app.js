const game = new Game();;
game.startGame();

/**** Event Listeners ******/

document.querySelector('#gameboard').addEventListener( 'click', (e) => {
    if (e.target.tagName === 'DIV') {
        if (!game.didJump) {
            game.selectToken(e.target);
        }
    } else if (game.tokenSelected && e.target.tagName === 'LI') {
        game.moveToken(e.target)      
    }
})

document.getElementById('end-turn').addEventListener( 'click', () => {
    game.switchPlayer();
})