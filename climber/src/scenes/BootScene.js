export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x2b2d4a).setOrigin(0, 0);

    this.add
      .text(width / 2, height / 2 - 80, 'CLIMBING GYM', {
        fontSize: '56px',
        fontStyle: 'bold',
        color: '#ffd166',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 20, 'A tiny climber, three big walls', {
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 60, 'Arrow keys / WASD to move', {
        fontSize: '18px',
        color: '#cdd2ff',
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 + 90, 'Up to climb ladders & grab bars', {
        fontSize: '18px',
        color: '#cdd2ff',
      })
      .setOrigin(0.5);
    this.add
      .text(width / 2, height / 2 + 120, 'Space to jump', {
        fontSize: '18px',
        color: '#cdd2ff',
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(width / 2, height - 80, 'Press SPACE to start', {
        fontSize: '24px',
        color: '#06d6a0',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game');
    });
  }
}
