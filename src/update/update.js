import EventHandler from "../event/eventHandler.js";

const Update = class Update {

  constructor (model, display) {
    this.model = model;
    this.display = display;
    this.eventHandler = new EventHandler();
    this.addObservers();
  }

  addObservers () {
    let { balls, ballsOut, players, message, result, gameState } = this.model;
    
    this.addSetAndGet (
      result, 
      "left", 
      "_left", 
      [ message.update.bind(message) ], 
      []);

    this.addSetAndGet (
      result, 
      "right",
      "_right", 
      [ message.update.bind(message) ], 
      []);
    
    const render = this.display.render.bind(this.display);

    this.addSetAndGet(
      gameState,
      "value",
      "_value",
      [...balls.map((ball) => ball.gameStateChange.bind(ball))
      ],
      []);
    
    
    this.addSetAndGet(
      players[0],
      "y",
      "_y",
      [], [render]);
    
    this.addSetAndGet(
      players[1],
      "y",
      "_y",
      [], [render]); 
    
    balls.forEach(
      ball => {
        this.addSetAndGet(ball, "x", "_x", [], [render]);
        this.addSetAndGet(ball, "y", "_y", [], [render]);
        this.addSetAndGet(
          ball, 
          "isOut", 
          "_isOut", 
          [
            (ballOut, isOut, value) => {
              if (!value) return;
              balls = balls.filter( ball => ball != ballOut );
              ballsOut.push(ballOut);
              ballOut.restoreDefault.call(ballOut);
              
              if ( ( result.left === 9 & value === "left") 
                || (result.right === 9 & value === "right") ) {
                result.update.call(result, "", "restart", "");
                message.update.call(message, result, value, 10);
                balls.forEach(ball => ball.isOut = "neither");
                ballsOut = balls.concat(ballsOut);
                balls = [];
              }
              else result.update.call(result, result, isOut, value);
              
              if (balls.length === 0) {
                gameState.value = "paused";
                balls = ballsOut.concat();
                balls.forEach(ball => ball.isOut = false);
                ballsOut = [];
                
                render(balls[0], "isOut", balls[0].isOut);
              } 
            }
          ], []);
      }
    );
    this.addSetAndGet(message, "value", "_value", [], [render]);
  }    

  addSetAndGet (target, name, _private, updateHandlers=[], renderHandlers=[]) {
    Object.defineProperty(target, name, {
      get() {
        return target[_private];
      },
    
      set(value) {
        target[_private] = value;
        updateHandlers.concat(renderHandlers).forEach(handler =>
          handler(this, name, value)
        );
      }
    })
  }

  loop(oldTime, time) {
    
    oldTime = oldTime || 0;
    time = time || oldTime;
    
    requestAnimationFrame((time) => this.loop(time, oldTime));

    const leftPlayer = this.model.players.filter(player => player.constants.type === "left")[0],
          rightPlayer = this.model.players.filter(player => player.constants.type === "right")[0],
          keyState  = this.eventHandler;

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
    if (this.model.gameState.value === "playing" && progress < 2) {;
      this.model.balls.forEach( ball => {
        if (!ball.isOut) ball.move(progress);
      });
    }
  }
}

export default Update;