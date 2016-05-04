'use strict';

class Game {
    constructor(parameters) {
        this.reset();

        this.container = parameters.container;

        this.init();
    }

    reset() {
        this.numberOfGames = 11;
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

        this.showGameCountPopup();
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

    showGameCountPopup() {
        var popup = document.createElement('div'),
            buttons = document.createElement('div'),
            button1 = document.createElement('span'),
            button2 = document.createElement('span');

        popup.className = 'popup';
        buttons.className = 'buttons';

        button1.innerHTML = '11 mängu';
        button2.innerHTML = '21 mängu';

        button1.onclick = this.gameCountButtonClick.bind(this, 11);
        button2.onclick = this.gameCountButtonClick.bind(this, 21);

        buttons.appendChild(button1);
        buttons.appendChild(button2);

        popup.appendChild(buttons);

        this.container.appendChild(popup);
    }

    hideGameCountPopup() {
        var popup = this.container.getElementsByClassName('popup')[0];
        popup.parentNode.removeChild(popup);
    }

    gameCountButtonClick(numberOfGames) {
        this.hideGameCountPopup();
        this.numberOfGames = numberOfGames;
    }

    showWinnerPopup() {
        var popup = document.createElement('div'),
            result = document.createElement('span');

        popup.className = 'popup';
        result.className = 'result';

        if (this.score.player > this.score.computer) {
            result.innerHTML = 'Player wins!';
        } else if (this.score.computer > this.score.player) {
            result.innerHTML = 'Computer wins!';
        } else {
            result.innerHTML = 'Tie!';
        }

        popup.appendChild(result);

        this.container.appendChild(popup);
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

    evaluateWinner() {
        if (this.score.player + this.score.computer >= this.numberOfGames) {
            this.showWinnerPopup();
            return true;
        }

        return false;
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
            // If no game winner yet, then go to next round
            if (!this.evaluateWinner()) {
                this.disableMouse = false;
                this.computer.reset();
                this.player.reset();
            }
        }.bind(this), 1000);
    }

        bestMove(expectedMove) {
        switch (expectedMove) {
            case 'rock':
                return this.computer.paper();
            case 'paper':
                return this.computer.scissors();
            case 'scissors':
                return this.computer.rock();
            default:
        }
    }

    computerMove() {
        // Move stacks available at: 'this.stacks'
        var playerStackLength = this.stacks.player.length;
        if (this.detectPattern(3, 1)) {
            //Player plays only one hand
            return this.bestMove(this.stacks.player[playerStackLength - 1]);
        }
        if (this.detectPattern(4, 2)) {
            //Player alternates between two hands
            return this.bestMove(this.stacks.player[playerStackLength - 2]);
        }
        if (this.detectPattern(6, 3)) {
            //Player plays three different hands in the same order
            return this.bestMove(this.stacks.player[playerStackLength - 3]);
        }
        this.computer.randomMove();
    }

    detectPattern(movesToCheck, patternLength) {
        if (this.stacks.player.length >= movesToCheck) {
            var lastMoves = this.stacks.player.slice(- movesToCheck);
            for (var i = 0; i < lastMoves.length - patternLength; i++) {
                if (lastMoves[i] !== lastMoves[i + patternLength]) return false;
            }
            return true;
        }
        return false;
    }
}
