const EventHandler = class EventHandler {
  constructor() {
    this.KeyA = false;
    this.KeyZ = false;
    this.ArrowUp = false;
    this.ArrowDown = false;
    this.Space = false;
    this.renderButtonClicked = false;
    document.addEventListener("keydown", this.updateKeyState.bind(this));
    document.addEventListener("keyup", this.updateKeyState.bind(this));
    document.querySelector("#renderButton").addEventListener("click", () => this.renderButtonClicked = true);
  }
  
  updateKeyState(ev) {
    if (ev.code in this) {
      this[ev.code] = ev.type === "keydown";  
      ev.preventDefault();
    }
  } 
}

export default EventHandler