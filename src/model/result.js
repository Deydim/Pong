const Result = class Result {
  constructor(arr, gameState) {
    this.gameState = gameState;
    this._left = arr[0];
    this._right = arr[1];
  }

  get value () {
    return [this._left, this._right];
  }

  update(_, name, value) {
    if (name === "isOut") this[value]++;
    if (name === "restart")
     this._left = this._right = 0;    
  }
}

export default Result;