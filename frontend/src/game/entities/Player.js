import Phaser from 'phaser';

import { AudioManager } from '../core/AudioManager';
import { WORLD_WIDTH } from '../core/GameConfig';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    Player.createTextures(scene);

    super(
      scene,
      x,
      y,
      'tr-player-idle'
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(
      0.5,
      1
    );

    this.setSize(
      34,
      62
    );

    this.setOffset(
      15,
      8
    );

    /*
     * Do not use Phaser world-bound collision for
     * vertical movement. Otherwise a falling player
     * can become stuck at the bottom of the world.
     *
     * GameScene handles horizontal limits and death.
     */
    this.setCollideWorldBounds(
      false
    );

    this.setDepth(10);

    /*
     * Manual movement only.
     *
     * A / LEFT  = left
     * D / RIGHT = right
     * W / UP / SPACE = jump
     * S / DOWN = crouch
     */

    this.speed = 300;

    this.jumpVelocity = 570;

    this.animClock = 0;

    this.animFrame = 0;

    this.invulnerableUntil = 0;

    /*
     * No acceleration and no horizontal friction.
     */
    this.setDragX(0);

    this.setMaxVelocity(
      1000,
      1000
    );

    if (this.body) {
      this.body.setAccelerationX(
        0
      );

      this.body.setDragX(
        0
      );

      this.body.setBounce(
        0,
        0
      );
    }
  }

  updateControls({
    left = false,
    right = false,
    jump = false,
    crouch = false,
  } = {}) {
    if (
      !this.active ||
      !this.body
    ) {
      return;
    }

    const body =
      this.body;

    /*
     * Dynamic max velocity.
     */
    this.setMaxVelocity(
      Math.max(
        100,
        this.speed
      ),
      1000
    );

    /*
     * Ground detection.
     */
    const grounded =
      body.blocked.down ||
      body.touching.down ||
      body.onFloor();

    /*
     * Crouching.
     */
    const isCrouching =
      Boolean(
        crouch &&
        grounded
      );

    if (isCrouching) {
      this.setSize(
        34,
        38
      );

      this.setOffset(
        15,
        32
      );
    } else {
      this.setSize(
        34,
        62
      );

      this.setOffset(
        15,
        8
      );
    }

    /*
     * ==================================================
     * MANUAL HORIZONTAL MOVEMENT
     * ==================================================
     */

    if (
      right &&
      !left
    ) {
      body.setVelocityX(
        this.speed
      );

      this.setFlipX(
        false
      );
    } else if (
      left &&
      !right
    ) {
      body.setVelocityX(
        -this.speed
      );

      this.setFlipX(
        true
      );
    } else {
      body.setVelocityX(
        0
      );
    }

    /*
     * Always remove acceleration.
     */
    body.setAccelerationX(
      0
    );

    body.setDragX(
      0
    );

    /*
     * Horizontal world limits.
     */
    if (
      this.x <= 20 &&
      body.velocity.x < 0
    ) {
      this.setX(20);

      body.setVelocityX(
        0
      );
    }

    if (
      this.x >=
        WORLD_WIDTH - 20 &&
      body.velocity.x > 0
    ) {
      this.setX(
        WORLD_WIDTH - 20
      );

      body.setVelocityX(
        0
      );
    }

    /*
     * ==================================================
     * JUMP
     * ==================================================
     */

    if (
      jump &&
      grounded &&
      !isCrouching
    ) {
      body.setVelocityY(
        -this.jumpVelocity
      );

      AudioManager.play(
        'jump'
      );
    }

    /*
     * ==================================================
     * RUNNING ANIMATION
     * ==================================================
     */

    this.animClock +=
      this.scene.game.loop.delta;

    if (
      Math.abs(
        body.velocity.x
      ) > 30 &&
      grounded &&
      !isCrouching &&
      this.animClock >= 80
    ) {
      this.animClock = 0;

      this.animFrame =
        (
          this.animFrame + 1
        ) % 4;
    }

    /*
     * ==================================================
     * TEXTURE
     * ==================================================
     */

    let textureKey =
      'tr-player-idle';

    if (!grounded) {
      textureKey =
        body.velocity.y < 0
          ? 'tr-player-jump'
          : 'tr-player-fall';
    } else if (
      isCrouching
    ) {
      textureKey =
        'tr-player-crouch';
    } else if (
      Math.abs(
        body.velocity.x
      ) > 30
    ) {
      textureKey =
        `tr-player-run-${
          this.animFrame + 1
        }`;
    }

    if (
      this.texture.key !==
      textureKey
    ) {
      this.setTexture(
        textureKey
      );
    }

    /*
     * ==================================================
     * INVULNERABILITY FLASH
     * ==================================================
     */

    if (
      this.scene.time.now <
      this.invulnerableUntil
    ) {
      this.setAlpha(
        0.55 +
          Math.sin(
            this.scene.time.now /
              55
          ) *
            0.35
      );
    } else {
      this.setAlpha(1);
    }
  }

  hit() {
    if (
      !this.active
    ) {
      return false;
    }

    if (
      this.scene.time.now <
      this.invulnerableUntil
    ) {
      return false;
    }

    this.invulnerableUntil =
      this.scene.time.now +
      1100;

    this.setTexture(
      'tr-player-hit'
    );

    if (this.body) {
      this.body.setVelocityX(
        0
      );

      this.body.setAccelerationX(
        0
      );
    }

    return true;
  }

  resetAt(
    x,
    y,
    invulnerabilityMs = 1200
  ) {
    if (
      !this.active
    ) {
      return;
    }

    this.setPosition(
      x,
      y
    );

    if (this.body) {
      this.body.reset(
        x,
        y
      );

      this.body.setVelocity(
        0,
        0
      );

      this.body.setAcceleration(
        0,
        0
      );

      this.body.setDragX(
        0
      );

      this.body.setBounce(
        0,
        0
      );
    }

    this.setAlpha(1);

    this.invulnerableUntil =
      this.scene.time.now +
      invulnerabilityMs;

    this.animClock = 0;

    this.animFrame = 0;

    this.setTexture(
      'tr-player-idle'
    );
  }

  stop() {
    if (
      !this.body
    ) {
      return;
    }

    this.body.setVelocity(
      0,
      0
    );

    this.body.setAcceleration(
      0,
      0
    );

    this.body.setDragX(
      0
    );
  }

  static createTextures(scene) {
    if (
      scene.textures.exists(
        'tr-player-idle'
      )
    ) {
      return;
    }

    const pose = (
      key,
      arms,
      legs,
      head = 0
    ) => {
      const g =
        scene.add.graphics();

      g.fillStyle(
        0xf4f4f4
      );

      g.fillCircle(
        32,
        14 + head,
        11
      );

      g.lineStyle(
        5,
        0xf4f4f4
      );

      g.lineBetween(
        32,
        26,
        32,
        54
      );

      g.lineBetween(
        ...arms[0]
      );

      g.lineBetween(
        ...arms[1]
      );

      g.lineBetween(
        ...legs[0]
      );

      g.lineBetween(
        ...legs[1]
      );

      g.generateTexture(
        key,
        64,
        72
      );

      g.destroy();
    };

    pose(
      'tr-player-idle',
      [
        [32, 34, 19, 45],
        [32, 34, 45, 45],
      ],
      [
        [32, 54, 20, 68],
        [32, 54, 44, 68],
      ]
    );

    pose(
      'tr-player-run-1',
      [
        [32, 34, 22, 46],
        [32, 34, 46, 26],
      ],
      [
        [32, 54, 22, 68],
        [32, 54, 43, 60],
      ]
    );

    pose(
      'tr-player-run-2',
      [
        [32, 34, 20, 54],
        [32, 34, 45, 44],
      ],
      [
        [32, 54, 24, 62],
        [32, 54, 40, 68],
      ]
    );

    pose(
      'tr-player-run-3',
      [
        [32, 34, 42, 46],
        [32, 34, 22, 26],
      ],
      [
        [32, 54, 38, 68],
        [32, 54, 23, 60],
      ]
    );

    pose(
      'tr-player-run-4',
      [
        [32, 34, 46, 54],
        [32, 34, 20, 44],
      ],
      [
        [32, 54, 40, 62],
        [32, 54, 24, 68],
      ]
    );

    pose(
      'tr-player-jump',
      [
        [32, 33, 20, 24],
        [32, 33, 42, 22],
      ],
      [
        [32, 54, 26, 60],
        [32, 54, 38, 60],
      ]
    );

    pose(
      'tr-player-fall',
      [
        [32, 35, 22, 20],
        [32, 35, 42, 20],
      ],
      [
        [32, 54, 26, 66],
        [32, 54, 38, 66],
      ]
    );

    pose(
      'tr-player-crouch',
      [
        [32, 32, 22, 42],
        [32, 32, 42, 42],
      ],
      [
        [32, 48, 25, 60],
        [32, 48, 39, 60],
      ],
      2
    );

    pose(
      'tr-player-hit',
      [
        [32, 35, 18, 48],
        [32, 35, 46, 48],
      ],
      [
        [32, 54, 20, 68],
        [32, 54, 44, 68],
      ]
    );
  }
}