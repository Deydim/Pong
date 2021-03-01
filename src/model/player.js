const Player = class Player {
  constructor(options) {
    const {type, field, width, height} = options;
    this.constants = options;
    this._y = field.height / 2 - height / 2;
    
    this.x = 
      type === "left" 
      ? 0 
      : field.width - width;

    this.centerX = this.x + width/2;
  }

  get y() {
    return this._y;
  }
  get centerY() {
    return this._y + this.constants.height / 2;
  }

  move (offset) {
    const {field, height} = this.constants;
    this.y = 
      Math.max(
        10,
        Math.min(
          this.y + offset, 
          field.height - height + 9
        )
      );
  }
};

export default Player;