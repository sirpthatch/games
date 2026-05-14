const BODY_WIDTH = 26;
const BODY_HEIGHT = 56;
const RUN_SPEED = 200;
const JUMP_VELOCITY = -540;
const CLIMB_SPEED = 160;

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    this.container = scene.add.container(x, y);

    this.legL = scene.add.rectangle(-6, 20, 9, 14, 0x2c5fb3).setOrigin(0.5, 0);
    this.legR = scene.add.rectangle(6, 20, 9, 14, 0x2c5fb3).setOrigin(0.5, 0);
    this.shoeL = scene.add.rectangle(-6, 34, 11, 5, 0x222222);
    this.shoeR = scene.add.rectangle(6, 34, 11, 5, 0x222222);

    this.torso = scene.add.rectangle(0, 8, 24, 22, 0xe63946).setOrigin(0.5);
    this.armL = scene.add.rectangle(-14, 8, 7, 18, 0xf2c6a0).setOrigin(0.5);
    this.armR = scene.add.rectangle(14, 8, 7, 18, 0xf2c6a0).setOrigin(0.5);

    this.necklace = scene.add.container(0, -5);
    const beadColors = [0xff4d6d, 0xffb703, 0x06d6a0, 0x118ab2, 0x9d4edd, 0xff6b35];
    for (let i = 0; i < beadColors.length; i++) {
      const angle = -Math.PI / 2 + (i - (beadColors.length - 1) / 2) * 0.35;
      const r = 13;
      const bx = Math.cos(angle) * r;
      const by = Math.sin(angle) * r + 8;
      this.necklace.add(scene.add.circle(bx, by, 2.5, beadColors[i]));
    }

    this.head = scene.add.circle(0, -16, 11, 0xffd9b3);
    this.hair = scene.add.ellipse(0, -22, 22, 12, 0xf4d35e);
    this.hairFringe = scene.add.ellipse(-4, -16, 14, 6, 0xf4d35e);
    this.eyeL = scene.add.circle(-4, -16, 1.5, 0x222222);
    this.eyeR = scene.add.circle(4, -16, 1.5, 0x222222);
    this.mouth = scene.add.rectangle(0, -11, 5, 1.5, 0x222222);

    this.container.add([
      this.legL,
      this.legR,
      this.shoeL,
      this.shoeR,
      this.torso,
      this.armL,
      this.armR,
      this.necklace,
      this.head,
      this.hair,
      this.hairFringe,
      this.eyeL,
      this.eyeR,
      this.mouth,
    ]);

    scene.physics.world.enable(this.container);
    const body = this.container.body;
    body.setSize(BODY_WIDTH, BODY_HEIGHT);
    body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT / 2 + 10);
    body.setCollideWorldBounds(false);
    body.setMaxVelocity(RUN_SPEED, 900);

    this.state = 'idle';
    this.facing = 1;
    this.onLadder = false;
    this.onBar = false;
    this.inTube = false;
    this.controlsLocked = false;
    this.ladderCooldownUntil = 0;
    this.barCooldownUntil = 0;
    this.tubeCooldownUntil = 0;
    this.invincibleUntil = 0;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      JUMP: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.walkPhase = 0;
  }

  get body() {
    return this.container.body;
  }

  get x() {
    return this.container.x;
  }

  get y() {
    return this.container.y;
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
    this.body.reset(x, y);
  }

  update(dt) {
    if (this.controlsLocked || this.inTube) {
      this.body.setVelocity(0, 0);
      this.body.allowGravity = false;
      return;
    }

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.JUMP);

    const body = this.body;

    if (this.onBar) {
      body.allowGravity = false;
      body.setVelocityY(0);
      if (left) {
        body.setVelocityX(-RUN_SPEED * 0.7);
        this.facing = -1;
      } else if (right) {
        body.setVelocityX(RUN_SPEED * 0.7);
        this.facing = 1;
      } else {
        body.setVelocityX(0);
      }
      this.armL.setRotation(-0.6);
      this.armR.setRotation(0.6);
      if (down || jumpPressed) {
        this.releaseBar(jumpPressed ? 250 : 500);
        if (jumpPressed) body.setVelocityY(JUMP_VELOCITY * 0.7);
      }
      this.state = 'hang';
      return;
    }

    this.armL.setRotation(0);
    this.armR.setRotation(0);

    if (this.onLadder) {
      body.allowGravity = false;
      if (up) {
        body.setVelocityY(-CLIMB_SPEED);
        this.walkPhase += dt * 0.012;
      } else if (down) {
        body.setVelocityY(CLIMB_SPEED);
        this.walkPhase += dt * 0.012;
      } else {
        body.setVelocityY(0);
      }
      if (left) {
        body.setVelocityX(-RUN_SPEED * 0.5);
        this.facing = -1;
      } else if (right) {
        body.setVelocityX(RUN_SPEED * 0.5);
        this.facing = 1;
      } else {
        body.setVelocityX(0);
      }
      const sway = Math.sin(this.walkPhase * 4) * 6;
      this.legL.y = 20 - Math.max(0, sway);
      this.legR.y = 20 + Math.min(0, sway);
      this.shoeL.y = this.legL.y + 14;
      this.shoeR.y = this.legR.y + 14;
      if (jumpPressed) {
        this.releaseLadder(300);
        body.setVelocityY(JUMP_VELOCITY * 0.8);
      }
      this.state = 'climb';
      return;
    }

    body.allowGravity = true;

    if (left) {
      body.setVelocityX(-RUN_SPEED);
      this.facing = -1;
    } else if (right) {
      body.setVelocityX(RUN_SPEED);
      this.facing = 1;
    } else {
      body.setVelocityX(0);
    }

    const onGround = body.blocked.down || body.touching.down;
    if (jumpPressed && onGround) {
      body.setVelocityY(JUMP_VELOCITY);
    }

    if (onGround && (left || right)) {
      this.walkPhase += dt * 0.018;
      const sway = Math.sin(this.walkPhase * 6) * 4;
      this.legL.y = 20 - sway;
      this.legR.y = 20 + sway;
      this.shoeL.y = this.legL.y + 14;
      this.shoeR.y = this.legR.y + 14;
      this.state = 'run';
    } else {
      this.legL.y = 20;
      this.legR.y = 20;
      this.shoeL.y = 34;
      this.shoeR.y = 34;
      this.state = onGround ? 'idle' : 'jump';
    }

    this.container.scaleX = this.facing;
  }

  canAttachLadder() {
    return this.scene.time.now >= this.ladderCooldownUntil;
  }

  canAttachBar() {
    return this.scene.time.now >= this.barCooldownUntil;
  }

  canEnterTube() {
    return this.scene.time.now >= this.tubeCooldownUntil;
  }

  attachLadder() {
    this.onLadder = true;
    this.body.allowGravity = false;
  }

  releaseLadder(cooldownMs = 0) {
    this.onLadder = false;
    this.body.allowGravity = true;
    if (cooldownMs) this.ladderCooldownUntil = this.scene.time.now + cooldownMs;
  }

  attachBar(barY) {
    this.onBar = true;
    this.body.allowGravity = false;
    this.body.setVelocity(0, 0);
    this.container.y = barY + 11;
    this.body.reset(this.container.x, this.container.y);
  }

  releaseBar(cooldownMs = 0) {
    this.onBar = false;
    this.body.allowGravity = true;
    if (cooldownMs) this.barCooldownUntil = this.scene.time.now + cooldownMs;
  }

  enterTube(path, onComplete) {
    this.inTube = true;
    this.body.allowGravity = false;
    this.body.setVelocity(0, 0);
    this.scene.tweens.add({
      targets: this.container,
      x: { value: path.exitX, duration: path.duration },
      y: { value: path.exitY, duration: path.duration },
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        this.body.reset(this.container.x, this.container.y);
      },
      onComplete: () => {
        this.inTube = false;
        this.body.allowGravity = true;
        this.tubeCooldownUntil = this.scene.time.now + 800;
        if (onComplete) onComplete();
      },
    });
  }

  lockControls(locked) {
    this.controlsLocked = locked;
  }

  isInvincible() {
    return this.scene.time.now < this.invincibleUntil;
  }

  hitByObstacle(spikeX) {
    if (this.isInvincible()) return false;
    this.invincibleUntil = this.scene.time.now + 1200;
    const dir = this.container.x < spikeX ? -1 : 1;
    this.releaseLadder();
    this.releaseBar();
    this.body.allowGravity = true;
    this.body.setVelocityX(dir * 240);
    this.body.setVelocityY(-260);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0.3,
      duration: 110,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.container.alpha = 1;
      },
    });
    return true;
  }
}
