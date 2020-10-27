class Game {
    constructor() {
        this.players = this.createPlayers();
        this.board = new Board();
        this.tokenSelected = null;
        this.didJump = false;
    }

    createPlayers() {
        let players = [];
        players.push(new Player('Player 1', 'black'));
        players.push(new Player('Player 2', 'red'));
        return players;
    }

    get activePlayer() {
        if (this.players[0].isActive) {
            return this.players[0]
        } else {
            return this.players[1]
        }
    }

    switchPlayer() {
        document.querySelector('.selected').classList.remove('selected');
        this.tokenSelected = null;
        this.didJump = false;
        this.players[0].isActive = !this.players[0].isActive;
        this.players[1].isActive = !this.players[1].isActive;
        document.getElementById('end-turn').setAttribute('disabled', true);
        document.getElementById('player-turn').innerHTML = `${this.activePlayer.name}'s Turn`;
        if (this.activePlayer.color === 'black') {
            document.querySelector('.fas').style.alignSelf = 'flex-end';
        } else {
            document.querySelector('.fas').style.alignSelf = 'flex-start';
        }
    }

    startGame() {
        this.board.drawBoardHTML();
        this.placeTokens();
        this.players[0].isActive = true;
        document.getElementById('player-turn').textContent = `${this.activePlayer.name}'s Turn`;
    }

    endGame(message) {
        alert(message);
    }

    placeTokens() {
        for (let player of this.players) {
            let tokenCounter = 0;
            if (player.color === 'black') {
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i][7].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i, 7).innerHTML = `<div id="token-${tokenCounter}" class="token black"></div>`;
                    player.tokens[i].HTMLpointer = this.getHTMLpointer(2*i, 7, 'token');
                    player.tokens[tokenCounter].x = 2*i;
                    player.tokens[tokenCounter].y = 7;
                    tokenCounter++; 
                }
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i + 1][6].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i + 1, 6).innerHTML = `<div id="token-${tokenCounter}" class="token black"></div>`;
                    player.tokens[i].HTMLpointer = this.getHTMLpointer(2*i + 1, 6, 'token');
                    player.tokens[tokenCounter].x = 2*i + 1
                    player.tokens[tokenCounter].y = 6;
                    tokenCounter++; 
                }
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i][5].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i, 5).innerHTML = `<div id="token-${tokenCounter}" class="token black"></div>`;
                    player.tokens[i].HTMLpointer = this.getHTMLpointer(2*i, 5,'token');
                    player.tokens[tokenCounter].x = 2*i; 
                    player.tokens[tokenCounter].y = 5;
                    tokenCounter++; 
                }
            } else {
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i + 1][0].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i + 1, 0).innerHTML = `<div id="token-${tokenCounter}" class="token red"></div>`;
                    player.tokens[i].HTMLpoiner = this.getHTMLpointer(2*i + 1, 0, 'token');
                    player.tokens[tokenCounter].x = 2*i + 1;
                    player.tokens[tokenCounter].y = 0;
                    tokenCounter++; 
                }
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i][1].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i, 1).innerHTML = `<div id="token-${tokenCounter}" class="token red"></div>`;
                    player.tokens[i].HTMLpointer = this.getHTMLpointer(2*i, 1, 'token');
                    player.tokens[tokenCounter].x = 2*i
                    player.tokens[tokenCounter].y = 1;
                    tokenCounter++;
                }
                for (let i = 0; i < 4; i++) {
                    this.board.spaces[2*i + 1][2].occupiedBy = player.tokens[i];
                    this.getHTMLpointer(2*i + 1, 2).innerHTML = `<div id="token-${tokenCounter}" class="token red"></div>`;
                    player.tokens[i].HTMLpointer = this.getHTMLpointer(2*i + 1, 2, 'token');
                    player.tokens[tokenCounter].x = 2*i + 1;
                    player.tokens[tokenCounter].y = 2;
                    tokenCounter++;
                }

            }   
        }
    }

    selectToken(tokenPointer) {
        if ( document.querySelector('.selected') ) {
            document.querySelector('.selected').classList.remove('selected');
        }
        if (tokenPointer.className.includes(`${this.activePlayer.color}`)) {
            tokenPointer.classList.add('selected');
            this.tokenSelected = this.activePlayer.tokens[tokenPointer.getAttribute("id").split('-').pop()];
        }
    }

    moveToken(targetSpace) {
            let newPosition = targetSpace.getAttribute('id').split('-').pop();
            if ( this.checkValidMove(newPosition[0], newPosition[1])) {
                let prevSpace = this.getHTMLpointer(this.tokenSelected.x, this.tokenSelected.y);
                let prevPosition = prevSpace.getAttribute('id').split('-').pop();
                let tokenHTML = prevSpace.innerHTML;
                prevSpace.innerHTML = '';
                targetSpace.innerHTML = tokenHTML;
                this.tokenSelected.x = parseInt(newPosition[0]);
                this.tokenSelected.y = parseInt(newPosition[1]);
                this.board.spaces[newPosition[0]][newPosition[1]].occupiedBy = this.tokenSelected;
                this.board.spaces[prevPosition[0]][prevPosition[1]].occupiedBy = null;
                //check if now King
                console.log(newPosition[1])
                if (newPosition[1] == 0 || newPosition[1] == 7){
                    this.tokenSelected.isKing = true;
                    document.querySelector('.selected').innerHTML = '<i class="fas fa-crown fa-lg"></i>';
                } 
                //check for jump;
                if (this.didJump) {
                    document.getElementById('end-turn').removeAttribute('disabled', false);
                } else {
                    this.switchPlayer();
                }
            }
    }

    checkValidMove(targetX, targetY) {
        let xOffset = targetX - this.tokenSelected.x;
        let yOffset = targetY - this.tokenSelected.y;

        if ( this.activePlayer.color === 'red' || this.tokenSelected.isKing) {
            if (Math.abs(xOffset) === 1 && yOffset === 1 && !this.didJump) { 
                if (!this.board.spaces[this.tokenSelected.x + xOffset][this.tokenSelected.y + yOffset].occupiedBy) {
                    this.didJump = false;
                    return true;
                }
            }
            if (Math.abs(xOffset) === 2  && yOffset === 2) {
                if (this.board.spaces[this.tokenSelected.x + xOffset/2][this.tokenSelected.y + yOffset/2].occupiedBy &&
                    !this.board.spaces[this.tokenSelected.x + xOffset][this.tokenSelected.y + yOffset].occupiedBy) {
                        this.board.spaces[this.tokenSelected.x + xOffset/2][this.tokenSelected.y + yOffset/2].occupiedBy = null;
                        this.getHTMLpointer(this.tokenSelected.x + xOffset/2, this.tokenSelected.y + yOffset/2).innerHTML = '';
                        if (this.players[0].isActive) {
                            this.players[1].remainingTokens--;
                        } else {
                            this.players[0].remainingTokens--;
                        }
                        this.didJump = true;
                        return true;
                }
            }
        }  
        if ( this.activePlayer.color === 'black' || this.tokenSelected.isKing) {
            if (Math.abs(xOffset) === 1 && yOffset === -1 && !this.didJump) { 
                if (!this.board.spaces[this.tokenSelected.x + xOffset][this.tokenSelected.y + yOffset].occupiedBy) {
                    this.didJump = false;
                    return true;
                }
            }
            if (Math.abs(xOffset) === 2  && yOffset === -2) {
                if (this.board.spaces[this.tokenSelected.x + xOffset/2][this.tokenSelected.y + yOffset/2].occupiedBy &&
                    !this.board.spaces[this.tokenSelected.x + xOffset][this.tokenSelected.y + yOffset].occupiedBy) {
                        this.board.spaces[this.tokenSelected.x + xOffset/2][this.tokenSelected.y + yOffset/2].occupiedBy = null;
                        this.getHTMLpointer(this.tokenSelected.x + xOffset/2, this.tokenSelected.y + yOffset/2).innerHTML = '';
                        if (this.players[0].isActive) {
                            this.players[1].remainingTokens--;
                            if (this.players[1].remainingTokens === 0) {
                                this.endGame(`${this.players[0].name} Wins!!!`)
                            }
                        } else {
                            this.players[0].remainingTokens--;
                            if (this.players[0].remainingTokens === 0) {
                                this.endGame(`${this.players[1].name} Wins!!!`)
                            }
                        }
                        this.didJump = true;
                        return true;
                }
            }
        }
        return false;
    }

    //     //check for occupied space
    //     if ( this.board.spaces[tempX][tempY].occupiedBy && this.board.spaces[tempX][tempY].occupiedBy.color !== this.tokenSelected.color ) {
    //         tempX += xOffset;
    //         tempY += yOffset;
    //         if (tempX >= 0 && tempX < this.board.length, tempY >= 0 && this.board.length && !this.board.spaces[tempX][tempY].occupiedBy) {
    //             validMoves[validMoveCounter].didJump = true;
    //             validMoveCounter++
    //             return {x: tempX,
    //                     y: tempY,
    //                     didJump: true};
    //         } else {
    //             return null;
       
            
    // }

    // getValidMoves() {
    //     let validMoves = [{}];
    //     let newValidMove;
    //     let tempX;
    //     let tempY;
    //     let validMoveCounter = 0;
    //     if (this.activePlayer.color === red || this.tokenSelected.isKing) {
    //         newValidMove = this.checkValidMove(1, -1)
    //         if (newValidMove) {
    //             validMoves[validMoveCounter] = newValidMove;
    //             validMoveCounter++;
    //         }
    //         newValidMove = this.checkValidMove(-1, -1)
    //         if (newValidMove) {
    //             validMoves[validMoveCounter] = newValidMove;
    //             validMoveCounter++;
    //         }
    //     }
    //     if (this.activePlayer.color === black || this.tokenSelected.isKing) {
    //         newValidMove = this.checkValidMove(1, 1)
    //         if (newValidMove) {
    //             validMoves[validMoveCounter] = newValidMove;
    //             validMoveCounter++;
    //         }
    //         newValidMove = this.checkValidMove(-1, 1)
    //         if (newValidMove) {
    //             validMoves[validMoveCounter] = newValidMove;
    //             validMoveCounter++;
    //         }
    //     }
    //     Valid
    // };


    // //         if (tempX >= 0 && tempX < this.board.length, tempY >= 0 && this.board.length) {
    // //             validMoves[validMoveCounter].x = tempX;
    // //             validMoves[validMoveCounter].y = tempY;
    // //         }       
    // //     } 
    // //     if (this.activePlayer.color === black || this.tokenSelected.isKing) {
    // //     }
    // // }
 
    // checkValidMove(xOffset, yOffset) {
    //     let tempX = this.tokenSelected.x + xOffset;
    //     let tempY= this.tokenSelected.y + yOffset;
    //     if (tempX >= 0 && tempX < this.board.length, tempY >= 0 && this.board.length) {     //check for out-of-bounds
    //         //check for occupied space
    //         if ( this.board.spaces[tempX][tempY].occupiedBy && this.board.spaces[tempX][tempY].occupiedBy.color !== this.tokenSelected.color ) {
    //             tempX += xOffset;
    //             tempY += yOffset;
    //             if (tempX >= 0 && tempX < this.board.length, tempY >= 0 && this.board.length && !this.board.spaces[tempX][tempY].occupiedBy) {
    //                 validMoves[validMoveCounter].didJump = true;
    //                 validMoveCounter++
    //                 return {x: tempX,
    //                         y: tempY,
    //                         didJump: true};
    //             } else {
    //                 return null;
    //             }
    //         }
    //         return { x: tempX,
    //                  y: tempY,
    //                  didJump: false};      
    //     }
    // }

    getHTMLpointer(x, y, type = 'space') {
        let HTMLpointer;
        if (type === 'token') {
            HTMLpointer = document.querySelector(`#space-${x}${y} div`);

        } else {
            HTMLpointer = document.querySelector(`#space-${x}${y}`);
        }
        return HTMLpointer;
    }

}