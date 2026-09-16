import Phaser from 'phaser';

const OBSTACLE_HEIGHT = 82;

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, def) {
    /*
     * Create the obstacle texture using
     * the fixed height.
     */
    Obstacle.createTexture(scene, def);

    super(
      scene,
      x,
      y,
      `obs-${def.id}`
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    /*
     * Keep the bottom of every obstacle
     * at the same Y position.
     */
    this.setOrigin(0.5, 1);

    /*
     * Every obstacle has the same height.
     *
     * Width remains different according to
     * the level configuration.
     */
    this.setDisplaySize(
      def.w + 4,
      OBSTACLE_HEIGHT + 4
    );

    /*
     * Physics collision body.
     *
     * Use the same fixed height so the
     * collision matches the visual obstacle.
     */
    this.setImmovable(true);

    this.body.setAllowGravity(false);

    this.body.setSize(
      this.width * 0.82,
      this.height * 0.86
    );

    /*
     * Center the physics body horizontally
     * and vertically inside the obstacle.
     */
    this.body.setOffset(
      this.width * 0.09,
      this.height * 0.07
    );

    this.setData(
      'hazard',
      true
    );

    this.setData(
      'type',
      def.label
    );

    this.setDepth(7);

    /*
     * Save the original spawn position.
     * Used by bobbing obstacles.
     */
    this.baseY = y;

    this.motion =
      def.motion || null;
  }

  preUpdate(time, delta) {
    super.preUpdate(
      time,
      delta
    );

    /*
     * Floating/bobbing obstacles.
     */
    if (
      this.motion === 'bob'
    ) {
      this.y =
        this.baseY +
        Math.sin(
          time / 350 +
          this.x / 200
        ) * 35;
    }

    /*
     * Horizontal moving obstacles.
     */
    if (
      this.motion === 'sweep'
    ) {
      this.x +=
        Math.sin(
          time / 600
        ) * 0.9;
    }
  }

  static createTexture(
    scene,
    def
  ) {
    const key =
      `obs-${def.id}`;

    /*
     * Do not recreate a texture that
     * already exists.
     */
    if (
      scene.textures.exists(key)
    ) {
      return;
    }

    const width =
      def.w;

    const height =
      OBSTACLE_HEIGHT;

    const g =
      scene.add.graphics();

    /*
     * Main obstacle body.
     */
    g.fillStyle(
      def.fill,
      1
    );

    g.lineStyle(
      3,
      def.stroke,
      1
    );

    g.fillRoundedRect(
      2,
      2,
      width,
      height,
      8
    );

    g.strokeRoundedRect(
      2,
      2,
      width,
      height,
      8
    );

    /*
     * Horizontal interface line.
     */
    g.fillStyle(
      0x07111d,
      1
    );

    g.fillRect(
      10,
      height * 0.42,
      Math.max(
        20,
        width - 20
      ),
      5
    );

    /*
     * Three interface lights.
     */
    g.fillStyle(
      def.stroke,
      1
    );

    g.fillCircle(
      width * 0.25,
      height * 0.30,
      5
    );

    g.fillCircle(
      width * 0.50,
      height * 0.30,
      5
    );

    g.fillCircle(
      width * 0.75,
      height * 0.30,
      5
    );

    /*
     * Generate texture with the fixed
     * obstacle height.
     */
    g.generateTexture(
      key,
      width + 4,
      height + 4
    );

    g.destroy();
  }
}