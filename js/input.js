const Input = {
  keys: {},

  init() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  },

  isKeyPressed(code) {
    return this.keys[code] || false;
  }
};
