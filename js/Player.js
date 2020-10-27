class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.isActive = false;
        this.tokens = this.createTokens();
        this.remainingTokens = 12;
    }

    createTokens() {
        let tokens = [];
        for (let i = 0; i < 12; i++){
            tokens.push(new Token(this.name, i))
            
        }
        return tokens; 
    }

    
}