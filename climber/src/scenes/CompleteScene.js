export class CompleteScene extends Phaser.Scene {
  constructor() {
    super('Complete');
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0);

    this.add
      .text(width / 2, height / 2 - 60, 'YOU CLIMBED THEM ALL!', {
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#ffd166',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, 'Three summits. One tiny climber.', {
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(width / 2, height / 2 + 80, 'Press SPACE to play again', {
        fontSize: '20px',
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
      this.scene.start('Boot');
    });
  }
}
