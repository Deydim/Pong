import Player from '../model/player.js'; 
import Ball from '../model/ball.js';
import Message from '../model/message.js';

const Display = class Display {
  constructor(model) {
    this.parentElement = model.parentElement;
    this.clear();
    this.offsetLeft = model.field.left;
    this.offsetTop = model.field.top;
    this.field = this.drawField(model.field);
    this.balls = this.drawBalls(model.balls);
    this.players = this.drawPlayers(model.players);
    this.message = this.displayMessage(model.field, model.message.value);
    this.rightPlayer = this.players[1];
    this.leftPlayer = this.players[0];
    
  }

  clear () {
    Array
    .from(this.parentElement.childNodes)
    .forEach(node => node.remove());
  }

  render (target, name, value) {
    switch (true) {
      case target instanceof Player:
        switch (target.constants.type) {
          case "right":
            this.rightPlayer.style.top = `${value + this.offsetTop}px`;
            break;
          case "left":
            this.leftPlayer.style.top = `${value + this.offsetTop}px`;
            break;
        }
        break;
      case target instanceof Ball:
        if (value === "invisible") {
          this.balls[target.index].style.display = "none";
          return;
        }
        if (value === "neither") {
          this.balls[target.index].style.display = "";
          return;
        }
        
        // if (target.isOut === "neither" && this.balls[target.index].style.display !== "")
        //   {console.log("set display visible");
        //   this.balls[target.index].style.display = "";}
        // if (!target.isOut !== "neither" && this.balls[target.index].style.display === "")
        //   {console.log("set display invisible");
        //   this.balls[target.index].style.display = "none";}

        switch (name) {
          case "y":
            this.balls.forEach( (_, index) => {
              if (index === target.index) this.balls[index].style.top = `${value + this.offsetTop}px`;
            });
            break;
          case "x":
            this.balls.forEach( (_, index) => {
              if (index === target.index) this.balls[index].style.left = `${value + this.offsetLeft}px`;
            });
            break;
        }
        break;
      case target instanceof Message:
        this.message.innerHTML = value;
        break;
    }
  }

  drawField (field) {
    let DOMField = this.createElement("div", {
      class: "field"
    }, {
      left: `${field.left}px`,
      top: `${field.top}px`,
      width: `${field.width}px`,
      height: `${field.height}px`
      })
      this.parentElement.appendChild(DOMField);  
    return DOMField;
  }
  
  drawPlayers(players) {
    let result = players.map(player => {
      let DOMPlayer = this.createElement("div", {
        class: "player"
      }, {
        left: `${player.x + this.offsetLeft}px`,
        top: `${player.y + this.offsetTop}px`,
        width: `${player.constants.width}px`,
        height: `${player.constants.height}px`,
      })
      this.parentElement.appendChild(DOMPlayer);
      return DOMPlayer; 
    })
    return result;
  }
  
  drawBalls(balls) {
    let result = balls.map(ball => {
      let DOMBall = this.createElement("div", {
        class: "ball"
      }, {
        left: `${ball.x + this.offsetLeft}px`,
        top: `${ball.y + this.offsetTop}px`,
        width: `${ball.constants.size}px`,
        height: `${ball.constants.size}px`,
        borderRadius: `${ball.constants.size/2}px`
      })
      this.parentElement.appendChild(DOMBall);
      return DOMBall; 
    })
    return result;
  }

  displayMessage ({ width: fieldWidth, size: fieldSize }, message) {
    let DOMMessage = this.createElement("div", {
      class: "message",
    }, {
      top: `${10 + fieldSize * 10 + this.offsetTop}px`,
      left: `${fieldWidth/2 - fieldSize * 50 + this.offsetLeft}px`,
      width: `${2*fieldSize * 50}px`,
      fontSize: `${fieldSize * 7}px`
    });
    DOMMessage.innerHTML = message;
    this.parentElement.appendChild(DOMMessage);
    return DOMMessage;
  }

  createElement(tag, attrs, styleProps) {
    let element = document.createElement(tag);
    for (let attr in attrs) {
      element.setAttribute(attr, attrs[attr])
    }
    for (let prop in styleProps) {
      element.style[prop] = styleProps[prop];
    }
    return element;
  } 

}

export default Display;