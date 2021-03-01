const GameState = class GameState {
  constructor(gameState) {
    this._value = gameState;
  }

  get value() {
    return this._value;
  }
}

export default GameState;