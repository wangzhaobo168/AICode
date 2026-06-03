
const Game = {
  state: 'start',
  mech1: null,
  mech2: null,

  init() {
    this.canvas = document.getElementById('gameCanvas');
    Renderer.init(this.canvas);
    Input.init();

    this.bindEvents();
    this.reset();
  },

  bindEvents() {
    document.getElementById('startBtn').addEventListener('click', () =&gt; {
      this.start();
    });

    document.getElementById('pauseBtn').addEventListener('click', () =&gt; {
      this.togglePause();
    });

    document.getElementById('restartBtn').addEventListener('click', () =&gt; {
      this.reset();
      this.start();
    });

    document.getElementById('playAgainBtn').addEventListener('click', () =&gt; {
      this.reset();
      this.showScreen('start');
    });
  },

  reset() {
    const controls1 = {
      left: 'KeyA',
      right: 'KeyD',
      up: 'KeyW',
      down: 'KeyS',
      attack: 'Space',
      defend: 'ShiftLeft'
    };

    const controls2 = {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      up: 'ArrowUp',
      down: 'ArrowDown',
      attack: 'Enter',
      defend: 'ControlLeft'
    };

    this.mech1 = new Mech(100, 300, 'blue', controls1);
    this.mech2 = new Mech(636, 300, 'red', controls2);
    this.updateUI();
  },

  start() {
    this.state = 'playing';
    this.showScreen('game');
    this.gameLoop();
  },

  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      document.getElementById('pauseBtn').textContent = '继续';
    } else if (this.state === 'paused') {
      this.state = 'playing';
      document.getElementById('pauseBtn').textContent = '暂停';
      this.gameLoop();
    }
  },

  showScreen(screen) {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');

    if (screen === 'start') {
      document.getElementById('startScreen').classList.remove('hidden');
    } else if (screen === 'game') {
      document.getElementById('gameScreen').classList.remove('hidden');
    } else if (screen === 'end') {
      document.getElementById('endScreen').classList.remove('hidden');
    }
  },

  update() {
    if (this.state !== 'playing') return;

    this.mech1.update(Input.keys, this.mech2, this.canvas.width, this.canvas.height);
    this.mech2.update(Input.keys, this.mech1, this.canvas.width, this.canvas.height);

    this.checkAttacks();
    this.checkGameOver();
    this.updateUI();
  },

  checkAttacks() {
    if (this.mech1.state === 'attacking' &amp;&amp; this.mech1.attackDuration === 15) {
      if (this.isInRange(this.mech1, this.mech2)) {
        this.mech2.takeDamage(15);
      }
    }

    if (this.mech2.state === 'attacking' &amp;&amp; this.mech2.attackDuration === 15) {
      if (this.isInRange(this.mech2, this.mech1)) {
        this.mech1.takeDamage(15);
      }
    }
  },

  isInRange(attacker, defender) {
    const attackRange = 100;
    const dx = (attacker.x + attacker.width / 2) - (defender.x + defender.width / 2);
    const dy = (attacker.y + attacker.height / 2) - (defender.y + defender.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const facingCorrect = (attacker.facing === 1 &amp;&amp; dx &lt; 0) || (attacker.facing === -1 &amp;&amp; dx &gt; 0);
    
    return distance &lt; attackRange &amp;&amp; !facingCorrect;
  },

  checkGameOver() {
    if (this.mech1.isDead()) {
      this.state = 'gameover';
      this.showWinner('玩家 2', 'red');
    } else if (this.mech2.isDead()) {
      this.state = 'gameover';
      this.showWinner('玩家 1', 'blue');
    }
  },

  showWinner(player, team) {
    const winnerText = document.getElementById('winnerText');
    winnerText.textContent = `${player} 获胜！`;
    winnerText.style.color = team === 'blue' ? '#00b4d8' : '#e94560';
    this.showScreen('end');
  },

  updateUI() {
    document.getElementById('health1').style.width = `${(this.mech1.health / this.mech1.maxHealth) * 100}%`;
    document.getElementById('health2').style.width = `${(this.mech2.health / this.mech2.maxHealth) * 100}%`;

    document.getElementById('status1').textContent = this.mech1.getStatusText();
    document.getElementById('status2').textContent = this.mech2.getStatusText();
  },

  render() {
    Renderer.clear();
    Renderer.drawBackground();
    Renderer.drawMech(this.mech1);
    Renderer.drawMech(this.mech2);
    Renderer.drawAttackEffect(this.mech1);
    Renderer.drawAttackEffect(this.mech2);
  },

  gameLoop() {
    if (this.state !== 'playing') return;

    this.update();
    this.render();

    requestAnimationFrame(() =&gt; this.gameLoop());
  }
};

window.addEventListener('load', () =&gt; {
  Game.init();
});
