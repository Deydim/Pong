import Model from './model/model.js';
import Display from './display/display.js';
import Update from './update/update.js';

// refactor branch 21

const Game = class Game {
  constructor() {
    this.model = new Model();
    this.display = new Display (this.model)
    this.update = new Update(this.model, this.display);
  }

  start() {
    this.update.loop();
  }
}

const game = new Game ();
game.start();