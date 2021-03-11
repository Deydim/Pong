import Player from './player.js';
import Ball from './ball.js';
import Message from './message.js';
import Field from './field.js';
import Result from './result.js';
import GameState from './gameState.js';

const Model = class Model {
  constructor() {
    const { ballSize, fieldSize, playerSize, ballCount } = Model.collectInputs();
    const playerHeight = playerSize*10;
    const playerWidth = 15;
    const ballSpeed = 1.9;
    const fieldTop = 50;
    const fieldLeft = 300;
    const inititalMessage =
        `« ↑ » and « ↓ » keys move right player. 
          Whoever gets 10 points first wins the game.
          Press «Space» to start.`;
    const parentElement = document.querySelector("#gameDiv");

    this.parentElement = parentElement;
    this.field = new Field(fieldSize / 10, fieldTop, fieldLeft);
    this.gameState = new GameState("paused");
    this.result = new Result([0, 0], this.gameState);
    this.message = new Message(inititalMessage);
    this.players = [
      new Player({type: "left", field: this.field, 
        width: playerWidth, height: playerHeight }), 
      new Player({type: "right", field: this.field, 
        width: playerWidth, height: playerHeight })
    ];
    this.balls = [];
      for (let i = 0; i < ballCount; i++) {
        let ball = 
          new Ball(
            { leftPlayer: this.players[0],
              rightPlayer: this.players[1],
              size: ballSize,
              field: this.field,
              speed: ballSpeed
            },
            i)
        this.balls.push(ball);
      }
    
    this.ballsOut = [];
  }
  static collectInputs() {
    return {
      fieldSize: document.querySelector("#inputFieldSize").value,
      playerSize: document.querySelector("#inputPlayerSize").value,
      ballSize: document.querySelector("#inputBallSize").value,
      ballCount: document.querySelector("#inputBallCount").value
    }
  }
}


export default Model;