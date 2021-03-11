import EventHandler from "../event/eventHandler.js";
import Ball from "../model/ball.js";
import Game from "../main.js";

const Update = class Update {

  constructor (model, display) {
    this.model = model;
    this.display = display;
    this.eventHandler = new EventHandler();
    this.addObservers();
    
  }

  addObservers () {
    const { balls, players, message, result, gameState } = this.model;
    
    this.observeProp (
      result, 
      "left", 
      "_left", 
       message.update.bind(message) );

    this.observeProp (
      result, 
      "right",
      "_right", 
       message.update.bind(message) );
    
    const render = this.display.render.bind(this.display);

    this.observeProp(
      gameState,
      "value",
      "_value",
      ...balls.map((ball) => ball.gameStateChange.bind(ball)));
    
    players.forEach(
      player => this.observeProp(player, "y", "_y", render)
    );
  
    balls.forEach(
      ball => {
        this.observeProp(ball, "x", "_x", render);
        this.observeProp(ball, "y", "_y", render);
        this.observeProp(
          ball, 
          "isOut", 
          "_isOut", 
          Ball.onBallOut.bind(this) 
        );
      }
    );

    this.observeProp(message, "value", "_value", render);
  }

  observeProp (targetObj, propName, _privatePropName, ...handlers) {
    Object.defineProperty(targetObj, propName, {
      get() {
        return targetObj[_privatePropName];
      },
    
      set(value) {
        targetObj[_privatePropName] = value;
        
        handlers.forEach(handler => {
          handler(this, propName, value)
        }
        );
      }
    })
  }

  gameLoop(oldTime, time) {
    
    oldTime = oldTime || 0;
    time = time || oldTime;
    
    const timer = requestAnimationFrame((time) => this.gameLoop(time, oldTime));

    const leftPlayer = this.model.players.filter(player => player.constants.type === "left")[0],
          rightPlayer = this.model.players.filter(player => player.constants.type === "right")[0],
          keyState  = this.eventHandler;
    if(keyState.renderButtonClicked) {
      cancelAnimationFrame(timer);
      return new Game();
    }
    if (this.model.balls[0].hitY < leftPlayer.centerY) leftPlayer.move(-4);
    if (this.model.balls[0].hitY > leftPlayer.centerY) leftPlayer.move(4);
    // if (keyState.KeyA ) leftPlayer.move(-6);
    // if (keyState.KeyZ ) leftPlayer.move(6);
    
    if (keyState.ArrowUp) rightPlayer.move(-10);    
    if (keyState.ArrowDown) rightPlayer.move(10);

    if (keyState.Space && this.model.gameState.value === "paused") {
      this.model.gameState.value = "playing";
      if (this.model.result.value.join() === [0, 0].join())   
        this.model.message.update(this.model.result);
    }
    const progress = (oldTime - time) / 15;
    if (this.model.gameState.value === "playing" && progress < 2)
      this.model.balls.forEach( ball => ball.move(progress));
  }
};

export default Update;