
class Mech {
  constructor(x, y, team, controls) {
    this.x = x;
    this.y = y;
    this.team = team;
    this.controls = controls;
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 4;
    this.width = 64;
    this.height = 64;
    this.state = 'idle';
    this.facing = team === 'blue' ? 1 : -1;
    this.attackCooldown = 0;
    this.defendCooldown = 0;
    this.attackDuration = 0;
    this.defendDuration = 0;
    this.moveDirection = { x: 0, y: 0 };
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(keys, otherMech, canvasWidth, canvasHeight) {
    if (this.attackCooldown &gt; 0) this.attackCooldown--;
    if (this.defendCooldown &gt; 0) this.defendCooldown--;
    if (this.attackDuration &gt; 0) {
      this.attackDuration--;
      if (this.attackDuration === 0) {
        this.state = 'idle';
      }
    }
    if (this.defendDuration &gt; 0) {
      this.defendDuration--;
      if (this.defendDuration === 0) {
        this.state = 'idle';
      }
    }

    if (this.state !== 'attacking' &amp;&amp; this.state !== 'defending') {
      this.moveDirection = { x: 0, y: 0 };
      if (keys[this.controls.left]) this.moveDirection.x = -1;
      if (keys[this.controls.right]) this.moveDirection.x = 1;
      if (keys[this.controls.up]) this.moveDirection.y = -1;
      if (keys[this.controls.down]) this.moveDirection.y = 1;

      if (this.moveDirection.x !== 0) {
        this.facing = this.moveDirection.x;
      }

      if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
        this.state = 'moving';
        const newX = this.x + this.moveDirection.x * this.speed;
        const newY = this.y + this.moveDirection.y * this.speed;
        
        if (newX &gt;= 0 &amp;&amp; newX + this.width &lt;= canvasWidth) {
          this.x = newX;
        }
        if (newY &gt;= 100 &amp;&amp; newY + this.height &lt;= canvasHeight) {
          this.y = newY;
        }
      } else {
        this.state = 'idle';
      }

      if (keys[this.controls.attack] &amp;&amp; this.attackCooldown === 0) {
        this.state = 'attacking';
        this.attackDuration = 20;
        this.attackCooldown = 40;
      }

      if (keys[this.controls.defend] &amp;&amp; this.defendCooldown === 0) {
        this.state = 'defending';
        this.defendDuration = 30;
        this.defendCooldown = 60;
      }
    }

    this.animTimer++;
    if (this.animTimer &gt; 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }
  }

  takeDamage(amount) {
    if (this.state === 'defending') {
      amount = Math.floor(amount * 0.3);
    }
    this.health = Math.max(0, this.health - amount);
  }

  isDead() {
    return this.health &lt;= 0;
  }

  getStatusText() {
    const statusMap = {
      idle: '待机',
      moving: '移动中',
      attacking: '攻击中',
      defending: '防御中'
    };
    return statusMap[this.state] || '待机';
  }
}
