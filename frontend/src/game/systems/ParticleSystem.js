export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
  }

  burst(x, y, count = 10) {
    const scene = this.scene;

    if (
      !scene ||
      !scene.add ||
      !scene.tweens
    ) {
      return;
    }

    for (let i = 0; i < count; i++) {
      const particle =
        scene.add.rectangle(
          x,
          y,
          5,
          5,
          0xf4f4f4
        );

      particle.setDepth(50);

      scene.tweens.add({
        targets: particle,

        x:
          x +
          (Math.random() - 0.5) *
            150,

        y:
          y +
          (Math.random() - 0.5) *
            100,

        alpha: 0,

        scaleX: 0.2,
        scaleY: 0.2,

        duration: 500,

        ease: 'Power2',

        onComplete: () => {
          if (
            particle &&
            particle.active
          ) {
            particle.destroy();
          }
        },
      });
    }
  }

  destroy() {
    this.scene = null;
  }
}