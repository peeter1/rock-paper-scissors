'use strict';

class Player {
    constructor(container) {
        this.container = container;
        this.init();
        this.status = null;
    }

    init() {
        this.originalContainerClass = this.container.className;
        this.container.style.backgroundColor = 'black';
    }

    randomMove() {
        // Select random method from array and call it
        [this.rock, this.paper, this.scissors][Math.floor(Math.random() * 3)].call(this);
    }

    rock() {
        this.status = 'rock';
        this.container.style.backgroundColor = 'white';
        this.container.className = this.originalContainerClass + ' rock';
    }

    paper() {
        this.status = 'paper';
        this.container.style.backgroundColor = 'white';
        this.container.className = this.originalContainerClass + ' paper';
    }

    scissors() {
        this.status = 'scissors';
        this.container.style.backgroundColor = 'white';
        this.container.className = this.originalContainerClass + ' scissors';
    }

    winner() {
        this.container.style.backgroundColor = 'green';
    }

    loser() {
        this.container.style.backgroundColor = 'red';
    }

    reset() {
        this.status = null;
        this.container.className = this.originalContainerClass;
        this.container.style.backgroundColor = 'black';
    }
}
