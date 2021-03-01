import Player from './player.js';
import Ball from './ball.js';
import Message from './message.js';
import Field from './field.js';
import Result from './result.js';
import GameState from './gameState.js';

const ballSize = 15 * Math.random() + 20;
const fieldSize = 3;
const ballSpeed = 1.9;
const playerHeight = 80;
const playerWidth = 15;
const fieldTop = 50;
const fieldLeft = 200;
const ballCount = 1;

const inititalMessage =
  `« ↑ » and « ↓ » keys move right player. 
    Whoever gets 10 points first wins the game.
    Press «Space» to start.`;

const field = new Field(fieldSize, fieldTop, fieldLeft);

const Model = class Model {
  constructor() {
    this.field = field;
    this.gameState = new GameState("paused");
    this.result = new Result([0, 0], this.gameState);
    this.message = new Message(inititalMessage);
    this.players = [
      new Player({type: "left", field: field, 
        width: playerWidth, height: playerHeight }), 
      new Player({type: "right", field: field, 
        width: playerWidth, height: playerHeight })
    ];
    this.balls = [];
      for (let i = 0; i < ballCount; i++) {
        let ball = 
          new Ball(
            { leftPlayer: this.players[0],
              rightPlayer: this.players[1],
              size: ballSize,
              field: field,
              speed: ballSpeed
            },
            i)
        this.balls.push(ball);
      }
    
    this.ballsOut = [];
  }
}

export default Model;