const vecEnum = {
    3: [3, 2],
    2: [4, 1.2],
    1: [5, 0.3],
    4: [0,0]
}
const Vec = class Vec {
  constructor(dir) {
    this.vx = vecEnum[dir][0];
    this.vy = vecEnum[dir][1];
  }
}

export default Vec;