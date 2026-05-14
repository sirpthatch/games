const COLORS = [
  0xff4d6d, 0xffb703, 0x06d6a0, 0x118ab2, 0x9d4edd, 0xff6b35, 0xffd166, 0xef476f,
];

export function ensureConfettiTexture(scene) {
  if (scene.textures.exists('confetti')) return;
  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 1);
  g.fillRect(0, 0, 8, 8);
  g.generateTexture('confetti', 8, 8);
  g.destroy();
}

export function burstConfetti(scene, x, y) {
  ensureConfettiTexture(scene);

  for (const color of COLORS) {
    const emitter = scene.add.particles(x, y, 'confetti', {
      speed: { min: 250, max: 600 },
      angle: { min: 200, max: 340 },
      lifespan: { min: 2200, max: 3200 },
      gravityY: 700,
      scale: { start: 1.2, end: 0.6 },
      rotate: { min: 0, max: 360 },
      tint: color,
      alpha: { start: 1, end: 0 },
      quantity: 1,
      emitting: false,
    });
    emitter.explode(22);
    scene.time.delayedCall(3500, () => emitter.destroy());
  }
}

export function smallBurst(scene, x, y) {
  ensureConfettiTexture(scene);
  const colors = [0xff4d6d, 0xffb703, 0x06d6a0, 0x118ab2, 0xffd166];
  for (const color of colors) {
    const emitter = scene.add.particles(x, y, 'confetti', {
      speed: { min: 90, max: 220 },
      angle: { min: 200, max: 340 },
      lifespan: { min: 500, max: 900 },
      gravityY: 500,
      scale: { start: 0.7, end: 0.3 },
      rotate: { min: 0, max: 360 },
      tint: color,
      alpha: { start: 1, end: 0 },
      quantity: 1,
      emitting: false,
    });
    emitter.explode(5);
    scene.time.delayedCall(1200, () => emitter.destroy());
  }
}
