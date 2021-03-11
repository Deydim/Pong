import Model from './model/model.js';
import Display from './display/display.js';
import Update from './update/update.js';

const Game = class Game {
  constructor() {
    this.model = new Model();
    this.display = new Display (this.model)
    this.update = new Update(this.model, this.display);
    this.start();
  }

  start() {
    //requestAnimationFrame(this.update.gameLoop.bind(this.update));
    this.update.gameLoop.call(this.update);
  }
}

new Game();

export default Game;