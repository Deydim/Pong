const Message = class Message {
  constructor (message) {
    this._value = message;
  }

  get value() {
    return this._value;
  } 

  update(result, playerType, value) {
    this.value = 
      `<span>${result.value[0]}</span><span>${result.value[1]}</span>`;
    if (value === 10) 
      this.value = 
        `${playerType === "left" ? "Left" : "Right"} player wins!
        Press «Space» to start a new game.`;
  }
}

export default Message;