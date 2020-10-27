class Board {
    constructor() {
        this.spaces = this.createSpaces();
    }

    createSpaces() {
        let spaces = [];
        for (let i = 0; i < 8; i++) {
            let column = [];
            for (let j = 0; j < 8; j++) {
                let newSpace = new Space(i, j);
                column.push(newSpace);
            }
            spaces.push(column);
        }
        return spaces;
    }

    drawBoardHTML() {
        let gameboard = '';
        for (let i = 0; i < 8; i++) {
            gameboard +=  `<ul id="row-${i+1}">`;
            for (let j = 0; j < 8; j++) {
                gameboard += `<li id="space-${j}${i}"></li>`;
            }
            gameboard += `</ul>`;
        }
        document.querySelector('#gameboard').innerHTML = gameboard;
    }

 
}