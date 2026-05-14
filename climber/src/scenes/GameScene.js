import { Player } from '../entities/Player.js';
import { LEVELS, LEVEL_HEIGHT, LEVEL_WIDTH } from '../world/levels.js';
import { buildLevel } from '../world/builder.js';
import { burstConfetti, smallBurst, ensureConfettiTexture } from '../fx/confetti.js';

const MAX_HEARTS = 3;

const WORLD_WIDTH = LEVEL_WIDTH * LEVELS.length;
const WORLD_HEIGHT = LEVEL_HEIGHT;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    ensureConfettiTexture(this);

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.platformsGroup = this.physics.add.staticGroup();
    this.builds = LEVELS.map((lvl) => buildLevel(this, lvl, this.platformsGroup));

    const first = LEVELS[0];
    this.currentLevelIndex = 0;
    this.player = new Player(this, first.baseX + first.spawn.x, first.spawn.y);

    this.physics.add.collider(
      this.player.container,
      this.platformsGroup,
      null,
      (playerObj, platform) => {
        if (this.player.onLadder || this.player.onBar || this.player.inTube) {
          return false;
        }
        const pb = playerObj.body;
        const platTop = platform.body.top;
        const prevBottom = pb.prev.y + pb.height;
        return prevBottom <= platTop + 1 && pb.velocity.y >= 0;
      },
    );

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(this.player.container, true, 0.15, 0.15);
    this.lockCameraToLevel(0);

    this.hud = this.add
      .text(16, 16, '', {
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.hearts = MAX_HEARTS;
    this.heartsHud = this.add
      .text(16, 50, '', {
        fontSize: '22px',
        color: '#ef476f',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.fruitsCollected = 0;
    this.totalFruits = this.builds.reduce((n, b) => n + b.fruits.length, 0);
    this.fruitHud = this.add
      .text(16, 86, '', {
        fontSize: '18px',
        color: '#ffd166',
        backgroundColor: '#00000088',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.updateHud();
    this.updateHearts();
    this.updateFruitHud();

    this.completedSummits = new Set();
    this.transitioning = false;

    this.touchingLadder = false;
    this.touchingBar = null;
    this.touchingTube = null;
    this.touchingSummit = null;

    this.keys = {
      up: this.input.keyboard.addKey('UP'),
      w: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('DOWN'),
      s: this.input.keyboard.addKey('S'),
    };

    this.input.keyboard.on('keydown-ONE', () => this.jumpToLevel(0));
    this.input.keyboard.on('keydown-TWO', () => this.jumpToLevel(1));
    this.input.keyboard.on('keydown-THREE', () => this.jumpToLevel(2));
    this.input.keyboard.on('keydown-FOUR', () => this.jumpToLevel(3));
  }

  jumpToLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;
    if (this.transitioning || this.player.inTube) return;

    const lvl = LEVELS[index];
    this.currentLevelIndex = index;

    this.player.releaseLadder();
    this.player.releaseBar();
    this.player.lockControls(false);
    this.player.body.allowGravity = true;
    this.player.body.setVelocity(0, 0);
    this.player.container.alpha = 1;
    this.player.invincibleUntil = 0;
    this.player.setPosition(lvl.baseX + lvl.spawn.x, lvl.spawn.y);

    this.hearts = MAX_HEARTS;
    this.updateHearts();

    this.cameras.main.stopFollow();
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.centerOn(
      lvl.baseX + LEVEL_WIDTH / 2,
      lvl.spawn.y,
    );
    this.cameras.main.startFollow(this.player.container, true, 0.15, 0.15);
    this.lockCameraToLevel(index);
    this.updateHud();
  }

  lockCameraToLevel(index) {
    const lvl = LEVELS[index];
    this.cameras.main.setBounds(lvl.baseX, 0, LEVEL_WIDTH, WORLD_HEIGHT);
  }

  updateHud() {
    const lvl = LEVELS[this.currentLevelIndex];
    this.hud.setText(`Level ${this.currentLevelIndex + 1} / ${LEVELS.length}  —  ${lvl.name}`);
  }

  updateHearts() {
    this.heartsHud.setText('♥ '.repeat(this.hearts).trim() || '♡');
  }

  updateFruitHud() {
    this.fruitHud.setText(`Fruit: ${this.fruitsCollected} / ${this.totalFruits}`);
  }

  update(time, dt) {
    if (this.player.container.y > WORLD_HEIGHT - 10 && !this.transitioning) {
      this.respawnCurrentLevel();
    }

    if (!this.transitioning) {
      this.checkInteractions();
    }

    this.player.update(dt);
  }

  checkInteractions() {
    if (this.player.inTube) return;
    const build = this.builds[this.currentLevelIndex];
    const upHeld =
      this.keys.up.isDown || this.keys.w.isDown;
    const downHeld =
      this.keys.down.isDown || this.keys.s.isDown;

    let overlappingLadder = false;
    for (const lad of build.ladders) {
      if (this.physics.world.overlap(this.player.container, lad)) {
        overlappingLadder = true;
        if (
          !this.player.onLadder &&
          (upHeld || downHeld) &&
          this.player.canAttachLadder()
        ) {
          this.player.attachLadder();
        }
        break;
      }
    }
    if (!overlappingLadder && this.player.onLadder) {
      this.player.releaseLadder();
    }

    if (
      !this.player.onLadder &&
      !this.player.onBar &&
      !this.player.inTube &&
      this.player.canAttachBar()
    ) {
      const inAir = !this.player.body.blocked.down && !this.player.body.touching.down;
      for (const bar of build.bars) {
        if (
          this.physics.world.overlap(this.player.container, bar) &&
          inAir &&
          this.player.body.velocity.y > -300
        ) {
          this.player.attachBar(bar.barY);
          break;
        }
      }
    }

    if (!this.player.inTube && this.player.canEnterTube()) {
      for (const tube of build.tubes) {
        if (this.physics.world.overlap(this.player.container, tube) && downHeld) {
          this.player.enterTube({
            exitX: tube.exitPoint.x,
            exitY: tube.exitPoint.y,
            duration: tube.duration,
          });
          break;
        }
      }
    }

    for (const f of build.fruits) {
      if (!f.collected && this.physics.world.overlap(this.player.container, f)) {
        this.collectFruit(f);
      }
    }

    if (!this.player.inTube) {
      for (const sp of build.spikes) {
        if (this.physics.world.overlap(this.player.container, sp)) {
          this.hitSpike(sp);
          break;
        }
      }
    }

    for (const summit of build.summits) {
      const key = `${this.currentLevelIndex}`;
      if (
        !this.completedSummits.has(key) &&
        this.physics.world.overlap(this.player.container, summit)
      ) {
        this.completedSummits.add(key);
        this.onSummitReached(summit);
        break;
      }
    }
  }

  collectFruit(fruit) {
    fruit.collected = true;
    smallBurst(this, fruit.x, fruit.y);
    this.tweens.add({
      targets: fruit.visual,
      scale: 1.6,
      alpha: 0,
      duration: 250,
      onComplete: () => fruit.visual.destroy(),
    });
    fruit.body.enable = false;
    this.fruitsCollected += 1;
    this.updateFruitHud();
  }

  hitSpike(spike) {
    if (!this.player.hitByObstacle(spike.x)) return;
    this.hearts -= 1;
    this.updateHearts();
    this.cameras.main.shake(180, 0.008);
    if (this.hearts <= 0) {
      this.hearts = MAX_HEARTS;
      this.updateHearts();
      this.time.delayedCall(400, () => this.respawnCurrentLevel());
    }
  }

  onSummitReached(summit) {
    this.transitioning = true;
    this.player.lockControls(true);
    this.player.body.setVelocity(0, 0);
    this.player.body.allowGravity = false;

    burstConfetti(this, summit.burstPoint.x, summit.burstPoint.y);

    this.tweens.add({
      targets: summit.flag,
      scaleY: 1.4,
      yoyo: true,
      duration: 250,
      repeat: 3,
    });

    const isLast = this.currentLevelIndex === LEVELS.length - 1;
    if (isLast) {
      this.time.delayedCall(2400, () => {
        this.scene.start('Complete');
      });
      return;
    }

    this.time.delayedCall(2200, () => this.transitionToNextLevel());
  }

  transitionToNextLevel() {
    const nextIndex = this.currentLevelIndex + 1;
    const nextLvl = LEVELS[nextIndex];

    this.cameras.main.stopFollow();
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const camTargetX = nextLvl.baseX;
    const camTargetY = WORLD_HEIGHT - this.cameras.main.height;

    this.tweens.add({
      targets: this.cameras.main,
      scrollX: camTargetX,
      scrollY: camTargetY,
      duration: 1600,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.currentLevelIndex = nextIndex;
        this.player.setPosition(nextLvl.baseX + nextLvl.spawn.x, nextLvl.spawn.y);
        this.player.body.allowGravity = true;
        this.player.lockControls(false);
        this.cameras.main.startFollow(this.player.container, true, 0.15, 0.15);
        this.lockCameraToLevel(nextIndex);
        this.transitioning = false;
        this.updateHud();
      },
    });
  }

  respawnCurrentLevel() {
    const lvl = LEVELS[this.currentLevelIndex];
    this.player.body.setVelocity(0, 0);
    this.player.setPosition(lvl.baseX + lvl.spawn.x, lvl.spawn.y);
  }
}
