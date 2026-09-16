import { Obstacle } from '../entities/Obstacle';
import { Coin } from '../entities/Coin';
import { PowerUp } from '../entities/PowerUp';

export class ObstacleSpawner {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;

    /*
     * First object position.
     */
    this.startX = 650;
    this.nextX = this.startX;

    /*
     * Object groups.
     */
    this.obstacles =
      scene.physics.add.group({
        allowGravity: false,
        immovable: true,
        runChildUpdate: false,
      });

    this.coins =
      scene.physics.add.group({
        allowGravity: false,
        immovable: true,
        runChildUpdate: false,
      });

    this.powerups =
      scene.physics.add.group({
        allowGravity: false,
        immovable: true,
        runChildUpdate: false,
      });

    this.index = 0;
  }

  /*
   * ==================================================
   * SPAWN OBJECTS AHEAD OF PLAYER
   * ==================================================
   */

  spawnUntil(playerX) {
    if (
      !Number.isFinite(playerX)
    ) {
      return;
    }

    const obstacles =
      Array.isArray(
        this.config?.obstacles
      )
        ? this.config.obstacles
        : [];

    if (
      obstacles.length === 0
    ) {
      return;
    }

    const spawnUntilX =
      playerX + 1700;

    while (
      this.nextX <
      spawnUntilX
    ) {
      const definition =
        obstacles[
          this.index %
          obstacles.length
        ];

      /*
       * Keep obstacles on the ground.
       */
      const obstacleY = 610;

      const obstacle =
        new Obstacle(
          this.scene,
          this.nextX,
          obstacleY,
          definition
        );

      this.obstacles.add(
        obstacle
      );

      /*
       * ==================================================
       * COINS
       * ==================================================
       */

      if (
        this.index % 2 === 0
      ) {
        const coinY =
          470 -
          (this.index % 3) * 40;

        const coin =
          new Coin(
            this.scene,
            this.nextX + 75,
            coinY
          );

        this.coins.add(
          coin
        );
      }

      /*
       * ==================================================
       * POWERUPS
       * ==================================================
       */

      if (
        this.index % 7 === 3
      ) {
        const type =
          this.index % 14 === 3
            ? 'shield'
            : 'boost';

        const powerup =
          new PowerUp(
            this.scene,
            this.nextX + 170,
            400,
            type
          );

        this.powerups.add(
          powerup
        );
      }

      /*
       * ==================================================
       * NEXT SPAWN
       * ==================================================
       *
       * Keep enough distance between obstacles so the
       * manually controlled player has room to react.
       */

      const spacing =
        380 +
        (this.index % 3) * 95;

      this.nextX +=
        spacing;

      this.index++;
    }
  }

  /*
   * ==================================================
   * RESET
   * ==================================================
   *
   * Used when the entire level is restarted.
   */

  reset() {
    this.obstacles?.clear(
      true,
      true
    );

    this.coins?.clear(
      true,
      true
    );

    this.powerups?.clear(
      true,
      true
    );

    this.nextX =
      this.startX;

    this.index = 0;
  }

  /*
   * ==================================================
   * CLEAR OBJECTS BEFORE POSITION
   * ==================================================
   *
   * Useful when restoring a checkpoint.
   *
   * Objects behind the player are removed so that
   * the player does not get trapped by old objects.
   */

  clearBehind(x) {
    const removeBehind =
      (group) => {
        if (!group) {
          return;
        }

        group.children.each(
          (child) => {
            if (
              child?.active &&
              child.x <
                x - 900
            ) {
              child.disableBody?.(
                true,
                true
              );
            }
          }
        );
      };

    removeBehind(
      this.obstacles
    );

    removeBehind(
      this.coins
    );

    removeBehind(
      this.powerups
    );
  }

  /*
   * ==================================================
   * DESTROY
   * ==================================================
   */

  destroy() {
    this.obstacles?.clear(
      true,
      true
    );

    this.coins?.clear(
      true,
      true
    );

    this.powerups?.clear(
      true,
      true
    );
  }
}