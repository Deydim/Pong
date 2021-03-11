import Vec from "./vec.js";

const Ball = class Ball {  
  constructor(options, index) { 
    const { field, size, speed } = options;

    this.constants = options;
    this._x = field.width / 2 - size / 2;
    this._y = field.height / 2 -size / 2 ;
    this.left = index % 2 ? 1 : -1;
    this.up = 1;
    this.speed = speed;
    this.hitY = field.height/2; 
    this.vx;
    this.vy;
    this._isOut = false;
    this.index = index;
  }
  
  get y() {
    return this._y;
  }
  get x() {
    return this._x;
  }
  get centerX() {
    return this._x + this.constants.size / 2;
  }
  get centerY() {
    return this._y + this.constants.size / 2;
  }
  get isOut () {
    return this._isOut;
  }

  move(progress) {
    const { vx, vy, up, left, speed, constants } = this;
    this.y = Math.max(
      10,
      Math.min(
        this.y + vy * up * speed * progress,
        constants.field.height - constants.size + 10,
      )
    );
    
    this.x -= vx * left * speed * progress;
    
    if (this.checkVerticalCollision()) this.collideVertically();

    const hasNarrowCollision =  this.checkBroadCollision() ? this.checkNarrowCollision() : null;
    if (hasNarrowCollision) this.collideWithPlayer() 

    else if (this.checkBallOut()) {
      this.isOut = left > 0 ? "right" : "left";
    }
  }

  collideWithPlayer () {
    const player = this.left < 0 ? this.constants.rightPlayer : this.constants.leftPlayer;
    this.x = 
      this.left > 0 
      ? player.x + player.constants.width + 1 
      : player.x - this.constants.size - 1;

    this.left = -this.left;
    this.speed = Math.min(this.speed + 0.08, 3);
    const hitPos = Math.round((((this.centerY - player.centerY) / player.constants.height) * 10) / 3);
    
    if (hitPos > 0) this.up = 1;
    if (hitPos < 0) this.up = -1;
    if (hitPos === 0) this.up = -this.up;
    const { vx, vy } = new Vec (Math.abs(hitPos) + 1);
    this.vx = vx;
    this.vy = vy;
    this.hitY = this.predictBallHit();
  }

  collideVertically () {
    this.up = -this.up;
  }

  checkVerticalCollision () {
    if (this.y === 10 || this.y === this.constants.field.height - this.constants.size + 10)
      return true;
    return false
  }
  checkNarrowCollision () {
    const player = this.left < 0 ? this.constants.rightPlayer : this.constants.leftPlayer;
    if (Math.abs(player.centerY - this.centerY) < (this.constants.size / 2 + player.constants.height / 2))
      return {player: player};
    return null;
  }
  checkBallOut () {
    const {constants} = this;
    if (this.centerX - constants.leftPlayer.centerX < -constants.size / 2 
    || constants.rightPlayer.centerX - this.centerX < -constants.size / 2 )
      return true;
    else return false;
  }

  checkBroadCollision () {
    const { constants } = this;
    if (this.centerX - constants.leftPlayer.centerX < (constants.size / 2 + constants.leftPlayer.constants.width / 2)
    || constants.rightPlayer.centerX - this.centerX < (constants.size / 2 + constants.rightPlayer.constants.width / 2))
      return true;
    else return false;
  }
  
  restoreDefault () {
    const { field, size } = this.constants;
    this.x = field.width / 2 - size / 2;
    this.y = field.height / 2 - size / 2 ;
    this.hitY = field.height/2;
    this.speed = 0;
  }

  gameStateChange (_, __, value) {
    if (value === "playing") {
      const {vx,vy} = new Vec(Math.ceil(3 * Math.random()));
      this.vx = vx;
      this.vy = vy;
      this.speed = this.constants.speed;
      this.hitY = this.predictBallHit();
    }
    if (value === "paused"){

    }
  }
  
  collideWithFloorCeiling () {
    this.up = -this.up;  
  }

  predictBallHit() {
    let { x, y, up, left } = this;
    const {field, size, leftPlayer, rightPlayer} = this.constants;
    const { vx, vy } = this;
    while ((x > leftPlayer.centerX) && (x < rightPlayer.centerX)) {
      x -= vx * left;
      y += vy * up;
      if (y < 10) {
        y = 10;
        up = -up;
      }
      if (y > field.height -size + 10) {
        y = field.height - size + 10;
        up = -up;
      }
    }
    return (
      y 
      + Math.round(leftPlayer.constants.height / 2 * Math.random()) 
      * (Math.random() < 0.5 ? -1 : 1)
    );
  }

  static onBallOut (ballOut, isOut, value) {
    let { balls, ballsOut, message, result, gameState } = this.model;
    if (value === "neither") return;
    this.model.ballsOut.push(ballOut);
    this.model.balls = this.model.balls.filter(ball => ball !== ballOut);
    this.display.render.call(this.display, ballOut, "_", "invisible");
    ballOut.restoreDefault.call(ballOut);    
    
    if ( ( result.left === 9 & value === "left") 
      || (result.right === 9 & value === "right") ) {
      this.model.gameState.value === "paused";
      this.model.ballsOut = this.model.balls.concat(this.model.ballsOut);
      this.model.balls.forEach(ball => ball.restoreDefault.call(ball));
      this.model.balls = [];
      result.update.call(result, "", "restart", "");
      message.update.call(message, result, value, 10);
    }
    else result.update.call(result, result, isOut, value);
    
    if (this.model.balls.length === 0) {
      gameState.value = "paused";
      this.model.balls = this.model.ballsOut.concat();
      this.model.balls.forEach(ball => ball.isOut = "neither");
      this.model.ballsOut = [];
      this.model.balls.forEach( ball =>
        this.display.render.call(this.display, ball, "_", "neither")
      );
    } 
  }
};

export default Ball;