const Field = class Field {
  constructor (size, top, left) {
    this.size = size;
    this.top = top;
    this.left = left;
  }
  get width() {
    return this.size * 220;
  }
  get height() {
    return (this.size / 3) * 440;
  }
}

export default Field;