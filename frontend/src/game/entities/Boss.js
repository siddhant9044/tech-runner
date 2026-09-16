import Phaser from 'phaser';

import { AudioManager } from '../core/AudioManager';

export class Boss {
  constructor(
    scene,
    x,
    y,
    target,
    onDefeated
  ) {
    this.scene = scene;

    this.x = x;
    this.y = y;

    this.originX = x;
    this.originY = y;

    this.target = target;

    this.maxHealth = 8;
    this.health = 8;

    this.defeated = false;

    this.onDefeated =
      onDefeated;

    this.lastShot = 0;

    /*
     * All boss projectiles live in one group
     * owned by GameScene.
     */
    if (
      !scene.bossProjectiles
    ) {
      scene.bossProjectiles =
        scene.physics.add.group({
          allowGravity: false,
        });
    }

    this.projectiles =
      scene.bossProjectiles;

    this.visual =
      this.createVisual(
        x,
        y
      );

    this.hitbox =
      scene.add
        .rectangle(
          x,
          y,
          150,
          190,
          0,
          0
        )
        .setDepth(7);

    scene.physics.add.existing(
      this.hitbox
    );

    this.hitbox.body
      .setAllowGravity(false)
      .setImmovable(true);
  }

  update(time) {
    if (
      this.defeated ||
      !this.scene
    ) {
      return;
    }

    const x =
      this.originX +
      Math.sin(
        time / 1300
      ) *
        65;

    const y =
      this.originY +
      Math.sin(
        time / 650
      ) *
        20;

    this.x = x;
    this.y = y;

    this.hitbox.setPosition(
      x,
      y
    );

    this.visual.setPosition(
      x,
      y
    );

    if (
      time -
        this.lastShot >
      2200
    ) {
      this.fire();

      this.lastShot =
        time;
    }
  }

  fire() {
    if (
      this.defeated
    ) {
      return;
    }

    const target =
      this.target?.();

    if (!target) {
      return;
    }

    const angle =
      Phaser.Math.Angle.Between(
        this.x,
        this.y,
        target.x,
        target.y - 35
      );

    const projectile =
      this.projectiles.create(
        this.x +
          Math.cos(angle) *
            85,
        this.y +
          Math.sin(angle) *
            85,
        'tr-boss-shot'
      );

    if (!projectile) {
      return;
    }

    projectile.setVelocity(
      Math.cos(angle) *
        240,
      Math.sin(angle) *
        240
    );

    projectile.setData(
      'hazard',
      true
    );

    AudioManager.play(
      'bossShoot'
    );
  }

  damage() {
    if (
      this.defeated
    ) {
      return;
    }

    this.health =
      Math.max(
        0,
        this.health - 1
      );

    this.scene.cameras.main.flash(
      70,
      255,
      255,
      255
    );

    AudioManager.play(
      'bossHit'
    );

    if (
      this.health <= 0
    ) {
      this.defeated =
        true;

      this.projectiles.clear(
        true,
        true
      );

      this.hitbox.setActive(
        false
      );

      if (
        this.hitbox.body
      ) {
        this.hitbox.body.enable =
          false;
      }

      this.visual.setVisible(
        false
      );

      AudioManager.play(
        'defeat'
      );

      this.onDefeated?.();
    }
  }

  destroy() {
    this.defeated =
      true;

    this.projectiles?.clear(
      true,
      true
    );

    if (
      this.hitbox
    ) {
      this.hitbox.destroy();
    }

    if (
      this.visual
    ) {
      this.visual.destroy(
        true
      );
    }

    this.scene = null;
  }

  createVisual(x, y) {
    const c =
      this.scene.add.container(
        x,
        y
      );

    const h =
      this.scene.add.graphics();

    h.fillStyle(
      0x0a0d12,
      1
    );

    h.lineStyle(
      5,
      0xff3d4e,
      1
    );

    const pts = [
      new Phaser.Geom.Point(
        0,
        -95
      ),
      new Phaser.Geom.Point(
        -60,
        -45
      ),
      new Phaser.Geom.Point(
        -50,
        70
      ),
      new Phaser.Geom.Point(
        0,
        100
      ),
      new Phaser.Geom.Point(
        50,
        70
      ),
      new Phaser.Geom.Point(
        60,
        -45
      ),
    ];

    h.fillPoints(
      pts,
      true
    );

    h.strokePoints(
      [
        ...pts,
        pts[0],
      ],
      true
    );

    const f =
      this.scene.add.graphics();

    f.fillStyle(
      0x020202,
      1
    );

    f.fillTriangle(
      -42,
      -25,
      42,
      -25,
      0,
      55
    );

    f.fillStyle(
      0xff3d4e,
      1
    );

    f.fillTriangle(
      -28,
      -8,
      -5,
      -3,
      -30,
      6
    );

    f.fillTriangle(
      28,
      -8,
      5,
      -3,
      30,
      6
    );

    const core =
      this.scene.add.graphics();

    core.fillStyle(
      0xff3d4e,
      0.85
    );

    core.lineStyle(
      3,
      0xf4f4f4,
      0.8
    );

    core.fillCircle(
      0,
      112,
      32
    );

    core.strokeCircle(
      0,
      112,
      32
    );

    c.add([
      h,
      f,
      core,
    ]);

    this.scene.tweens.add({
      targets: core,
      alpha: 0.35,
      duration: 350,
      yoyo: true,
      repeat: -1,
    });

    return c;
  }

  static createProjectile(scene) {
    if (
      scene.textures.exists(
        'tr-boss-shot'
      )
    ) {
      return;
    }

    const g =
      scene.add.graphics();

    g.fillStyle(
      0xff3d4e,
      1
    );

    g.lineStyle(
      2,
      0xf4f4f4,
      1
    );

    g.fillTriangle(
      0,
      9,
      28,
      0,
      28,
      18
    );

    g.strokeTriangle(
      0,
      9,
      28,
      0,
      28,
      18
    );

    g.generateTexture(
      'tr-boss-shot',
      28,
      18
    );

    g.destroy();
  }
}