const Renderer = {
  canvas: null,
  ctx: null,

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  },

  clear() {
    this.ctx.fillStyle = '#0a0a15';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawBackground() {
    this.ctx.fillStyle = '#1a1a2e';
    for (let y = 400; y < this.canvas.height; y += 20) {
      this.ctx.fillRect(0, y, this.canvas.width, 2);
    }
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 400, this.canvas.width, this.canvas.height - 400);

    this.ctx.fillStyle = '#16213e';
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.fillRect(x, 400, 20, 4);
    }
  },

  drawMech(mech) {
    const colors = mech.team === 'blue' 
      ? { primary: '#00b4d8', secondary: '#0077b6', dark: '#0f3460' }
      : { primary: '#e94560', secondary: '#c73e1d', dark: '#8b0000' };

    const ctx = this.ctx;
    const x = mech.x;
    const y = mech.y;
    const w = mech.width;
    const h = mech.height;
    const facing = mech.facing;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(facing, 1);
    ctx.translate(-w / 2, -h / 2);

    if (mech.state === 'defending') {
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = colors.dark;
    const legOffset = mech.state === 'moving' ? Math.sin(mech.animFrame * Math.PI / 2) * 4 : 0;
    
    ctx.fillRect(12, 40, 12, 24);
    ctx.fillRect(40, 40, 12, 24);

    ctx.fillStyle = colors.secondary;
    ctx.fillRect(8, 56, 20, 8);
    ctx.fillRect(36, 56, 20, 8);

    ctx.fillStyle = colors.primary;
    ctx.fillRect(12, 16, 40, 32);

    ctx.fillStyle = colors.secondary;
    ctx.fillRect(16, 8, 32, 20);

    ctx.fillStyle = '#fff';
    ctx.fillRect(36, 12, 8, 8);

    if (mech.state === 'attacking') {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(52, 24, 28, 8);
      ctx.fillRect(72, 20, 12, 16);
      
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(80, 16, 16, 24);
    } else {
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(52, 24, 16, 8);
    }

    ctx.fillStyle = colors.secondary;
    ctx.fillRect(0, 24, 8, 20);

    ctx.restore();
  },

  drawAttackEffect(mech) {
    if (mech.state === 'attacking' && mech.attackDuration > 10) {
      const ctx = this.ctx;
      const x = mech.x + (mech.facing === 1 ? mech.width : -30);
      const y = mech.y + mech.height / 2 - 20;
      
      ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
      ctx.fillRect(x, y, 40, 40);
      ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
      ctx.fillRect(x + 10, y + 10, 20, 20);
    }
  }
};
