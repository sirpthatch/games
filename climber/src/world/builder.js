import { LEVEL_HEIGHT, LEVEL_WIDTH } from './levels.js';

export class LevelBuild {
  constructor() {
    this.platforms = null;
    this.ladders = [];
    this.bars = [];
    this.tubes = [];
    this.summits = [];
    this.fruits = [];
    this.spikes = [];
  }
}

export function buildLevel(scene, level, platformsGroup) {
  const base = level.baseX;
  const build = new LevelBuild();
  build.platforms = platformsGroup;
  build.level = level;

  drawBackground(scene, level);

  for (const p of level.platforms) {
    const rect = scene.add.rectangle(
      base + p.x + p.w / 2,
      p.y + p.h / 2,
      p.w,
      p.h,
      p.color,
    );
    scene.physics.add.existing(rect, true);
    platformsGroup.add(rect);
  }

  const ladderGrabMargin = 36;
  for (const lad of level.ladders) {
    drawLadder(scene, base + lad.x, lad.y, lad.w, lad.h);
    const zoneY = lad.y - ladderGrabMargin;
    const zoneH = lad.h + ladderGrabMargin;
    const zone = scene.add.zone(
      base + lad.x + lad.w / 2,
      zoneY + zoneH / 2,
      lad.w,
      zoneH,
    );
    scene.physics.add.existing(zone, true);
    build.ladders.push(zone);
  }

  for (const bar of level.bars) {
    drawBar(scene, base + bar.x, bar.y, bar.w, bar.h);
    const zone = scene.add.zone(
      base + bar.x + bar.w / 2,
      bar.y + bar.h / 2,
      bar.w + 20,
      70,
    );
    zone.barY = bar.y + bar.h / 2;
    scene.physics.add.existing(zone, true);
    build.bars.push(zone);
  }

  for (const tube of level.tubes) {
    drawTube(scene, base + tube.entry.x, tube.entry.y, base + tube.exit.x, tube.exit.y, tube.color);
    const entryZone = scene.add.zone(base + tube.entry.x, tube.entry.y, 60, 60);
    scene.physics.add.existing(entryZone, true);
    entryZone.exitPoint = { x: base + tube.exit.x, y: tube.exit.y };
    entryZone.duration = 900;
    build.tubes.push(entryZone);
  }

  for (const f of level.fruits || []) {
    const visual = drawFruit(scene, base + f.x, f.y, f.color);
    const zone = scene.add.zone(base + f.x, f.y, 24, 24);
    scene.physics.add.existing(zone, true);
    zone.visual = visual;
    zone.collected = false;
    build.fruits.push(zone);
  }

  for (const sp of level.spikes || []) {
    const visual = drawSpike(scene, base + sp.x, sp.y);
    const zone = scene.add.zone(base + sp.x, sp.y, 22, 20);
    scene.physics.add.existing(zone, true);
    zone.visual = visual;
    build.spikes.push(zone);
  }

  const s = level.summit;
  const flag = drawSummit(scene, base + s.x + s.w / 2, s.y);
  const summitZone = scene.add.zone(base + s.x + s.w / 2, s.y - 10, s.w, 40);
  scene.physics.add.existing(summitZone, true);
  summitZone.flag = flag;
  summitZone.burstPoint = { x: base + s.x + s.w / 2, y: s.y - 30 };
  build.summits.push(summitZone);

  return build;
}

function drawBackground(scene, level) {
  const base = level.baseX;
  scene.add
    .rectangle(base, 0, LEVEL_WIDTH, LEVEL_HEIGHT, level.background)
    .setOrigin(0, 0);

  const g = scene.add.graphics();
  g.lineStyle(2, level.accent, 0.4);
  for (let y = 100; y < LEVEL_HEIGHT - 60; y += 80) {
    g.lineBetween(base + 20, y, base + LEVEL_WIDTH - 20, y);
  }
  for (let x = 80; x < LEVEL_WIDTH; x += 120) {
    g.lineBetween(base + x, 40, base + x, LEVEL_HEIGHT - 60);
  }

  const dots = scene.add.graphics();
  dots.fillStyle(0xffffff, 0.5);
  const rng = mulberry32(level.baseX + 1);
  for (let i = 0; i < 80; i++) {
    const dx = base + 30 + rng() * (LEVEL_WIDTH - 60);
    const dy = 40 + rng() * (LEVEL_HEIGHT - 100);
    const r = 3 + rng() * 4;
    const hue = Math.floor(rng() * 6);
    const colors = [0xff4d6d, 0xffb703, 0x06d6a0, 0x118ab2, 0xffd166, 0xef476f];
    dots.fillStyle(colors[hue], 0.8);
    dots.fillCircle(dx, dy, r);
  }

  scene.add
    .text(base + LEVEL_WIDTH / 2, 30, level.name, {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
    })
    .setOrigin(0.5);
}

function drawLadder(scene, x, y, w, h) {
  const g = scene.add.graphics();
  g.lineStyle(5, 0xc97b3d, 1);
  g.lineBetween(x + 4, y, x + 4, y + h);
  g.lineBetween(x + w - 4, y, x + w - 4, y + h);
  g.lineStyle(4, 0xc97b3d, 1);
  for (let ry = y + 14; ry < y + h; ry += 22) {
    g.lineBetween(x + 4, ry, x + w - 4, ry);
  }
}

function drawBar(scene, x, y, w, h) {
  const g = scene.add.graphics();
  g.fillStyle(0x888888, 1);
  g.fillRect(x, y, w, h);
  g.fillStyle(0xdddddd, 1);
  g.fillRect(x, y, w, 3);
  g.fillStyle(0x444444, 1);
  for (let rx = x + 10; rx < x + w; rx += 60) {
    g.fillCircle(rx, y + h / 2, 3);
  }
}

function drawTube(scene, ex, ey, xx, xy, color) {
  const g = scene.add.graphics();
  g.lineStyle(34, color, 0.85);
  g.beginPath();
  g.moveTo(ex, ey);
  const midX = (ex + xx) / 2;
  const midY = Math.min(ey, xy) - 60;
  g.lineTo(midX, midY);
  g.lineTo(xx, xy);
  g.strokePath();

  g.lineStyle(28, 0xffffff, 0.15);
  g.beginPath();
  g.moveTo(ex, ey);
  g.lineTo(midX, midY);
  g.lineTo(xx, xy);
  g.strokePath();

  scene.add.circle(ex, ey, 22, color).setAlpha(0.8);
  scene.add.circle(xx, xy, 22, color).setAlpha(0.8);
  scene.add
    .text(ex, ey - 30, 'IN', { fontSize: '14px', color: '#fff' })
    .setOrigin(0.5);
  scene.add
    .text(xx, xy - 30, 'OUT', { fontSize: '14px', color: '#fff' })
    .setOrigin(0.5);
}

function drawFruit(scene, x, y, color) {
  const c = scene.add.container(x, y);
  const fruit = scene.add.circle(0, 0, 10, color);
  const highlight = scene.add.circle(-3, -3, 3, 0xffffff).setAlpha(0.55);
  const stem = scene.add.rectangle(0, -10, 2, 4, 0x6b4423);
  const leaf = scene.add.ellipse(4, -10, 7, 3.5, 0x06d6a0);
  leaf.setRotation(0.5);
  c.add([fruit, highlight, stem, leaf]);
  scene.tweens.add({
    targets: c,
    y: y - 4,
    duration: 900,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return c;
}

function drawSpike(scene, x, y) {
  const c = scene.add.container(x, y);
  const num = 8;
  for (let i = 0; i < num; i++) {
    const a = (i / num) * Math.PI * 2;
    const sx = Math.cos(a) * 5;
    const sy = Math.sin(a) * 5;
    const spike = scene.add.triangle(sx, sy, 0, -8, 4, 2, -4, 2, 0x555555);
    spike.setRotation(a + Math.PI / 2);
    c.add(spike);
  }
  const body = scene.add.circle(0, 0, 9, 0x2a2a2a);
  const highlight = scene.add.circle(-3, -3, 2, 0x666666).setAlpha(0.6);
  const eyeL = scene.add.circle(-3, -1, 1.5, 0xff3333);
  const eyeR = scene.add.circle(3, -1, 1.5, 0xff3333);
  c.add([body, highlight, eyeL, eyeR]);
  scene.tweens.add({
    targets: c,
    angle: 8,
    duration: 450,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });
  return c;
}

function drawSummit(scene, x, y) {
  const poleH = 70;
  const g = scene.add.graphics();
  g.fillStyle(0x444444, 1);
  g.fillRect(x - 2, y - poleH, 4, poleH);
  const flag = scene.add.triangle(
    x + 18,
    y - poleH + 14,
    0,
    -14,
    36,
    0,
    0,
    14,
    0xff4d6d,
  );
  scene.add
    .text(x, y - poleH - 14, 'SUMMIT', {
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffffff',
    })
    .setOrigin(0.5);
  return flag;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
