'use strict';

class Game {
    constructor(parameters) {
        this.reset();

        this.container = parameters.container;

        this.init();
    }

    reset() {
        this.score = {
            player: 0,
            computer: 0
        };

        // Move history stacks
        this.stacks = {
            player: [],
            computer: []
        };

        this.disableMouse = true;
    }

    init() {
        // Find necessary DOM elements
        var players = this.container.getElementsByClassName('players')[0];
        this.playerContainer = players.getElementsByClassName('player')[0];
        this.computerContainer = players.getElementsByClassName('computer')[0];

        // Initialize players
        this.player = new Player(this.playerContainer);
        this.computer = new Player(this.computerContainer);

        this.initButtons();
        this.renderScores();

        this.disableMouse = false;
    }

    initButtons() {
        var buttons = this.container.getElementsByClassName('buttons')[0];

        buttons.getElementsByClassName('rock')[0].onclick = function() {
            if (!this.disableMouse) {
                this.player.rock();
                this.afterMove();
            }
        }.bind(this);

        buttons.getElementsByClassName('paper')[0].onclick = function() {
            if (!this.disableMouse) {
                this.player.paper();
                this.afterMove();
            }
        }.bind(this);

        buttons.getElementsByClassName('scissors')[0].onclick = function() {
            if (!this.disableMouse) {
                this.player.scissors();
                this.afterMove();
            }
        }.bind(this);
    }

    renderScores() {
        var scores = this.container.getElementsByClassName('scores')[0];

        scores.getElementsByClassName('player')[0].innerHTML = this.score.player;
        scores.getElementsByClassName('computer')[0].innerHTML = this.score.computer;
    }

    afterMove() {
        this.disableMouse = true;
        this.computerMove();
        setTimeout(function() {
            this.evaluate();
            this.updateStacks();
            this.renderScores();
            this.moveFinished();
        }.bind(this), 500);
    }

    evaluate() {
        switch (this.computer.status) {
            case 'rock':
                switch (this.player.status) {
                    case 'paper':
                        this.playerWins();
                        break;
                    case 'scissors':
                        this.computerWins();
                        break;
                    default:
                        return
                }
                break;
            case 'paper':
                switch (this.player.status) {
                    case 'scissors':
                        this.playerWins();
                        break;
                    case 'rock':
                        this.computerWins();
                        break;
                    default:
                        return
                }
                break;
            case 'scissors':
                switch (this.player.status) {
                    case 'rock':
                        this.playerWins();
                        break;
                    case 'paper':
                        this.computerWins();
                        break;
                    default:
                        return
                }
                break;
            default:
                return;
        }
    }

    playerWins() {
        this.score.player += 1;
        this.player.winner();
        this.computer.loser();
    }

    computerWins() {
        this.score.computer += 1;
        this.computer.winner();
        this.player.loser();
    }

    updateStacks() {
        this.stacks.player.push(this.player.status);
        this.stacks.computer.push(this.computer.status);
    }

    moveFinished() {
        setTimeout(function() {
            this.disableMouse = false;
            this.computer.reset();
            this.player.reset();
        }.bind(this), 1000);
    }

    computerMove() {
        // Move stacks available at: 'this.stacks'
        this.computer.randomMove();
    }
}
