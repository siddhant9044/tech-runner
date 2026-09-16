import Phaser from 'phaser';

import { Player } from '../entities/Player';
import { Boss } from '../entities/Boss';

import { ObstacleSpawner } from '../systems/ObstacleSpawner';
import { DifficultyManager } from '../systems/DifficultyManager';
import { ParticleSystem } from '../systems/ParticleSystem';

import { HUD } from '../ui/HUD';
import { MobileControls } from '../ui/MobileControls';
import { ComicMessageSystem } from '../ui/ComicMessageSystem';

import { GameState } from '../core/GameState';
import { LifeSystem } from '../core/LifeSystem';
import { calculateLocalScore } from '../core/ScoreSystem';
import { AudioManager } from '../core/AudioManager';

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  WORLD_WIDTH,
  GROUND_Y,
  PLAYER_START_X,
  PLAYER_START_Y,
  MAX_LIVES,
  CHECKPOINT_INTERVAL,
  DISTANCE_TARGET,
  LEVEL_COMPLETE_X,
  CYBER_BOSS_TRIGGER_X,
  CYBER_BOSS_PLAYER_X,
  CYBER_BOSS_X,
  PLAYER_FALL_Y,
} from '../core/GameConfig';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.config =
      this.registry.get(
        'levelConfig'
      ) || {};

    this.initialLives =
      Math.min(
        MAX_LIVES,
        Math.max(
          1,
          Math.floor(
            Number(
              this.registry.get(
                'initialLives'
              )
            ) || MAX_LIVES
          )
        )
      );

    this.state =
      new GameState(
        this.config.key,
        this.initialLives
      );

    this.lifeSystem =
      new LifeSystem(
        this.initialLives
      );

    this.finished = false;

    this.respawning = false;

    this.paused = false;

    this.bossMode = false;

    this.boss = null;

    this.lastHitAt = 0;

    this.attackCooldown = 0;

    /*
     * Latest checkpoint.
     */
    this.checkpointX =
      PLAYER_START_X;

    this.checkpointY =
      PLAYER_START_Y;

    this.checkpointDistance =
      0;

    this.checkpointNumber =
      0;

    /*
     * Last safe position.
     */
    this.lastSafeX =
      PLAYER_START_X;

    this.lastSafeY =
      PLAYER_START_Y;

    /*
     * Keyboard.
     */
    this.keyboardState =
      new Set();

    this.jumpRequested =
      false;

    this.attackRequested =
      false;
  }

  create() {
    this.physics.world.setBounds(
      0,
      0,
      WORLD_WIDTH,
      GAME_HEIGHT
    );

    this.buildBackground();

    this.buildWorld();

    /*
     * PLAYER
     */

    this.player =
      new Player(
        this,
        PLAYER_START_X,
        PLAYER_START_Y
      );

    this.player.stop();

    this.lastSafeX =
      this.player.x;

    this.lastSafeY =
      this.player.y;

    /*
     * SYSTEMS
     */

    this.particles =
      new ParticleSystem(
        this
      );

    this.spawner =
      new ObstacleSpawner(
        this,
        this.config
      );

    this.difficulty =
      new DifficultyManager(
        this,
        this.config
      );

    this.hud =
      new HUD(
        this,
        this.config
      );

    this.mobile =
      new MobileControls(
        this
      );

    this.comic =
      new ComicMessageSystem(
        this
      );

    /*
     * INPUT
     */

    this.buildKeyboardControls();

    this.buildMuteButton();

    /*
     * PLAYER / PLATFORM COLLISION
     */

    this.physics.add.collider(
      this.player,
      this.platforms
    );

    /*
     * OBSTACLES
     *
     * Important:
     * This is OVERLAP, not collider.
     *
     * Therefore obstacles cannot physically
     * stop the player.
     */

    this.physics.add.overlap(
      this.player,
      this.spawner.obstacles,
      (_player, obstacle) => {
        this.onObstacle(
          obstacle
        );
      }
    );

    /*
     * COINS
     */

    this.physics.add.overlap(
      this.player,
      this.spawner.coins,
      (_player, coin) => {
        this.onCoin(
          coin
        );
      }
    );

    /*
     * POWERUPS
     */

    this.physics.add.overlap(
      this.player,
      this.spawner.powerups,
      (_player, powerup) => {
        this.onPowerup(
          powerup
        );
      }
    );

    /*
     * PLAYER BULLETS
     */

    this.bullets =
      this.physics.add.group({
        allowGravity: false,
      });

    /*
     * BOSS PROJECTILES
     */

    this.bossProjectiles =
      this.physics.add.group({
        allowGravity: false,
      });

    Boss.createProjectile(
      this
    );

    this.physics.add.overlap(
      this.player,
      this.bossProjectiles,
      (_player, projectile) => {
        this.onBossProjectile(
          projectile
        );
      }
    );

    this.spawner.spawnUntil(
      this.player.x
    );

    this.updateHud();

    this.comic.show(
      `${
        this.config.name ||
        'LEVEL'
      } — RUN, JUMP, SURVIVE`,
      1500
    );

    /*
     * CAMERA
     *
     * The larger deadzone lets the player visibly
     * move around the screen before camera tracking.
     */

    this.cameras.main.setBounds(
      0,
      0,
      WORLD_WIDTH,
      GAME_HEIGHT
    );

    this.cameras.main.startFollow(
      this.player,
      true,
      0.12,
      0.12,
      -120,
      0
    );

    this.cameras.main.setDeadzone(
      560,
      220
    );

    this.events.once(
      'shutdown',
      this.cleanup,
      this
    );

    this.events.once(
      'destroy',
      this.cleanup,
      this
    );
  }

  buildBackground() {
    if (
      this.textures.exists(
        'level-background'
      )
    ) {
      this.add
        .tileSprite(
          WORLD_WIDTH / 2,
          360,
          WORLD_WIDTH,
          GAME_HEIGHT,
          'level-background'
        )
        .setDepth(-20)
        .setScrollFactor(
          0.15,
          0
        )
        .setTileScale(
          Math.max(
            1280 / 1664,
            720 / 936
          )
        );
    }

    this.add
      .rectangle(
        WORLD_WIDTH / 2,
        360,
        WORLD_WIDTH,
        GAME_HEIGHT,
        this.config.overlay ??
          0x06111d,
        0.45
      )
      .setDepth(-19)
      .setScrollFactor(
        0.15,
        0
      );
  }

  buildWorld() {
    this.platforms =
      this.physics.add.staticGroup();

    /*
     * Main ground.
     */

    const ground =
      this.add
        .rectangle(
          WORLD_WIDTH / 2,
          GROUND_Y + 60,
          WORLD_WIDTH,
          120,
          0x17222d
        )
        .setStrokeStyle(
          2,
          this.config.accent ??
            0x36b8ff
        );

    this.physics.add.existing(
      ground,
      true
    );

    this.platforms.add(
      ground
    );

    this.add.rectangle(
      WORLD_WIDTH / 2,
      GROUND_Y,
      WORLD_WIDTH,
      6,
      this.config.accent ??
        0x36b8ff,
      0.9
    );

    /*
     * Upper platforms.
     */

    const platformY =
      500;

    const platformData = [
      [850, platformY, 260],
      [1600, platformY, 300],
      [2450, platformY, 260],
      [3250, platformY, 300],
      [4100, platformY, 360],
      [5000, platformY, 300],
      [5900, platformY, 280],
      [6800, platformY, 260],
      [7700, platformY, 320],
      [8550, platformY, 260],
      [9400, platformY, 340],
      [10200, platformY, 280],
      [11000, platformY, 330],
      [11900, platformY, 300],
    ];

    platformData.forEach(
      ([x, y, width]) => {
        const platform =
          this.add
            .rectangle(
              x,
              y,
              width,
              22,
              0x263646
            )
            .setStrokeStyle(
              2,
              this.config.accent ??
                0x36b8ff,
              0.55
            );

        this.physics.add.existing(
          platform,
          true
        );

        this.platforms.add(
          platform
        );
      }
    );
  }

  buildKeyboardControls() {
    this.keys = {
      a:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.A
        ),

      d:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.D
        ),

      w:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.W
        ),

      s:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.S
        ),

      f:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.F
        ),

      left:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.LEFT
        ),

      right:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.RIGHT
        ),

      up:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.UP
        ),

      down:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.DOWN
        ),

      space:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.SPACE
        ),

      escape:
        this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.ESC
        ),
    };

    this.handleKeyDown =
      (event) => {
        if (
          this.finished
        ) {
          return;
        }

        const key =
          String(
            event.key || ''
          ).toLowerCase();

        const code =
          String(
            event.code || ''
          ).toLowerCase();

        const validKeys =
          [
            'a',
            'd',
            'w',
            's',
            'f',
            'arrowleft',
            'arrowright',
            'arrowup',
            'arrowdown',
            ' ',
            'spacebar',
            'escape',
          ];

        const validCodes =
          [
            'keya',
            'keyd',
            'keyw',
            'keys',
            'keyf',
            'arrowleft',
            'arrowright',
            'arrowup',
            'arrowdown',
            'space',
            'escape',
          ];

        if (
          !validKeys.includes(
            key
          ) &&
          !validCodes.includes(
            code
          )
        ) {
          return;
        }

        event.preventDefault();

        this.keyboardState.add(
          key
        );

        this.keyboardState.add(
          code
        );

        /*
         * One-shot jump.
         *
         * No old Phaser jump latch is used.
         */
        if (
          !event.repeat &&
          (
            key === 'w' ||
            code === 'keyw' ||
            key === 'arrowup' ||
            code === 'arrowup' ||
            key === ' ' ||
            key === 'spacebar' ||
            code === 'space'
          )
        ) {
          this.jumpRequested =
            true;
        }

        /*
         * Cyber attack.
         */
        if (
          !event.repeat &&
          (
            key === 'f' ||
            code === 'keyf'
          )
        ) {
          this.attackRequested =
            true;
        }

        if (
          !event.repeat &&
          (
            key === 'escape' ||
            code === 'escape'
          )
        ) {
          this.togglePause();
        }
      };

    this.handleKeyUp =
      (event) => {
        const key =
          String(
            event.key || ''
          ).toLowerCase();

        const code =
          String(
            event.code || ''
          ).toLowerCase();

        this.keyboardState.delete(
          key
        );

        this.keyboardState.delete(
          code
        );
      };

    this.handleBlur =
      () => {
        this.keyboardState.clear();

        this.jumpRequested =
          false;

        this.attackRequested =
          false;

        this.mobile?.releaseAll?.();
      };

    window.addEventListener(
      'keydown',
      this.handleKeyDown,
      {
        passive: false,
      }
    );

    window.addEventListener(
      'keyup',
      this.handleKeyUp
    );

    window.addEventListener(
      'blur',
      this.handleBlur
    );

    document.addEventListener(
      'visibilitychange',
      this.handleBlur
    );

    this.input.keyboard.enabled =
      true;

    this.input.keyboard.addCapture(
      [
        'A',
        'D',
        'W',
        'S',
        'F',
        'LEFT',
        'RIGHT',
        'UP',
        'DOWN',
        'SPACE',
        'ESC',
      ]
    );
  }

  buildMuteButton() {
    this.muteButton =
      this.add
        .text(
          GAME_WIDTH - 24,
          95,
          AudioManager.muted
            ? 'SOUND OFF'
            : 'SOUND ON',
          {
            fontFamily:
              'Arial',

            fontSize:
              '13px',

            fontStyle:
              'bold',

            color:
              '#ffffff',

            backgroundColor:
              '#07111dcc',

            padding: {
              left: 10,
              right: 10,
              top: 7,
              bottom: 7,
            },
          }
        )
        .setOrigin(
          1,
          0
        )
        .setScrollFactor(0)
        .setDepth(60)
        .setInteractive();

    this.muteButton.on(
      'pointerdown',
      () => {
        const muted =
          AudioManager.toggle();

        this.muteButton.setText(
          muted
            ? 'SOUND OFF'
            : 'SOUND ON'
        );
      }
    );
  }

  update(
    time,
    delta
  ) {
    if (
      this.finished ||
      this.paused
    ) {
      return;
    }

    this.state.time +=
      delta;

    this.attackCooldown =
      Math.max(
        0,
        this.attackCooldown -
          delta
      );

    const held =
      (...names) =>
        names.some(
          (name) =>
            this.keyboardState.has(
              name
            )
        );

    const phaserHeld =
      (key) =>
        Boolean(
          key?.isDown
        );

    /*
     * LEFT
     */

    const left =
      held(
        'a',
        'keya',
        'arrowleft'
      ) ||
      phaserHeld(
        this.keys?.a
      ) ||
      phaserHeld(
        this.keys?.left
      ) ||
      Boolean(
        this.mobile?.state?.left
      );

    /*
     * RIGHT
     */

    const right =
      held(
        'd',
        'keyd',
        'arrowright'
      ) ||
      phaserHeld(
        this.keys?.d
      ) ||
      phaserHeld(
        this.keys?.right
      ) ||
      Boolean(
        this.mobile?.state?.right
      );

    /*
     * CROUCH
     */

    const crouch =
      held(
        's',
        'keys',
        'arrowdown'
      ) ||
      phaserHeld(
        this.keys?.s
      ) ||
      phaserHeld(
        this.keys?.down
      ) ||
      Boolean(
        this.mobile?.state?.crouch
      );

    /*
     * JUMP
     */

    const jump =
      this.jumpRequested ||
      Boolean(
        this.mobile?.consumePress?.(
          'jump'
        )
      );

    this.jumpRequested =
      false;

    /*
     * ATTACK
     */

    const attack =
      this.attackRequested ||
      Boolean(
        this.mobile?.consumePress?.(
          'attack'
        )
      );

    this.attackRequested =
      false;

    /*
     * SPEED
     */

    const baseSpeed =
      this.difficulty.speedFor(
        this.state.distance
      );

    this.player.speed =
      this.bossMode
        ? Math.max(
            330,
            baseSpeed
          )
        : baseSpeed;

    /*
     * MOVEMENT
     */

    this.player.updateControls({
      left,
      right,
      jump,
      crouch,
    });

    /*
     * SAFE POSITION
     */

    this.updateSafePosition();

    /*
     * DISTANCE
     */

    this.updateDistance();

    /*
     * SPAWN
     */

    this.spawner.spawnUntil(
      this.player.x
    );

    /*
     * CHECKPOINT
     */

    this.updateCheckpoint();

    /*
     * HUD
     */

    this.updateHud();

    /*
     * FALL
     */

    if (
      this.player.y >
      PLAYER_FALL_Y
    ) {
      this.takeDamage({
        deathX:
          this.lastSafeX,

        deathY:
          this.lastSafeY,
      });

      return;
    }

    /*
     * CYBER BOSS
     */

    if (
      !this.bossMode &&
      this.config.key ===
        'cyber' &&
      this.player.x >=
        CYBER_BOSS_TRIGGER_X
    ) {
      this.startBoss();
    }

    /*
     * NORMAL LEVEL COMPLETE
     */

    if (
      !this.bossMode &&
      this.config.key !==
        'cyber' &&
      this.player.x >=
        LEVEL_COMPLETE_X
    ) {
      this.completeRunnerLevel();

      return;
    }

    /*
     * BOSS MODE
     */

    if (
      this.bossMode
    ) {
      if (attack) {
        this.shoot();
      }

      this.boss?.update(
        time
      );

      this.checkBossHits();
    }

    this.cleanupProjectiles();
  }

  updateSafePosition() {
    const body =
      this.player.body;

    if (
      body &&
      (
        body.blocked.down ||
        body.touching.down ||
        body.onFloor()
      )
    ) {
      this.lastSafeX =
        this.player.x;

      this.lastSafeY =
        this.player.y;

      this.state.setLastSafePosition(
        this.lastSafeX,
        this.lastSafeY
      );
    }
  }

  updateDistance() {
    const current =
      Math.min(
        DISTANCE_TARGET,
        Math.max(
          0,
          (
            this.player.x -
            PLAYER_START_X
          ) / 10
        )
      );

    /*
     * Never reduce recorded progress when
     * the player teleports back to a checkpoint.
     */
    this.state.distance =
      Math.max(
        this.state.distance,
        current
      );
  }

  updateCheckpoint() {
    while (
      this.state.distance >=
      this.checkpointDistance +
        CHECKPOINT_INTERVAL
    ) {
      this.checkpointDistance +=
        CHECKPOINT_INTERVAL;

      this.checkpointNumber +=
        1;

      this.checkpointX =
        Phaser.Math.Clamp(
          PLAYER_START_X +
            this.checkpointDistance *
              10,
          PLAYER_START_X,
          WORLD_WIDTH - 250
        );

      this.checkpointY =
        this.lastSafeY;

      this.state.setCheckpoint(
        this.checkpointX,
        this.checkpointY,
        this.checkpointDistance,
        this.checkpointNumber
      );

      this.comic.show(
        `CHECKPOINT ${this.checkpointNumber} — PROGRESS SAVED`,
        900
      );

      this.showCheckpointMarker();
    }
  }

  showCheckpointMarker() {
    const line =
      this.add
        .rectangle(
          this.checkpointX,
          GROUND_Y - 45,
          5,
          90,
          this.config.accent ??
            0x36b8ff,
          0.8
        )
        .setDepth(4);

    const text =
      this.add
        .text(
          this.checkpointX,
          GROUND_Y - 100,
          `CHECKPOINT ${this.checkpointNumber}`,
          {
            fontFamily:
              'Arial',

            fontSize:
              '12px',

            fontStyle:
              'bold',

            color:
              '#ffffff',

            backgroundColor:
              '#07111dcc',

            padding: {
              left: 8,
              right: 8,
              top: 5,
              bottom: 5,
            },
          }
        )
        .setOrigin(0.5)
        .setDepth(5);

    this.time.delayedCall(
      5000,
      () => {
        line.destroy();
        text.destroy();
      }
    );
  }

  /*
   * ==================================================
   * OBSTACLE HIT
   * ==================================================
   */

  onObstacle(
    obstacle
  ) {
    if (
      this.finished ||
      this.respawning ||
      this.time.now <
        this.lastHitAt
    ) {
      return;
    }

    if (
      !obstacle?.active
    ) {
      return;
    }

    /*
     * Remove the obstacle immediately.
     */
    obstacle.disableBody(
      true,
      true
    );

    this.lastHitAt =
      this.time.now + 1100;

    this.state.obstaclesHit +=
      1;

    /*
     * Lose exactly one life.
     */
    this.lifeSystem.loseLife();

    this.state.lives =
      this.lifeSystem.lives;

    this.state.score =
      calculateLocalScore(
        this.state
      );

    this.player.hit();

    AudioManager.play(
      'hit'
    );

    /*
     * ParticleSystem is now a real instance,
     * so this cannot crash the game loop.
     */
    this.particles.burst(
      this.player.x,
      this.player.y - 30,
      12
    );

    const label =
      obstacle.getData?.(
        'type'
      ) ||
      'OBSTACLE';

    /*
     * ==================================================
     * ALL LIVES LOST
     * ==================================================
     *
     * Checkpoint + 4 lives.
     */

    if (
      this.state.lives <= 0
    ) {
      this.comic.show(
        `${label} HIT — CHECKPOINT RESTART`,
        900
      );

      this.respawnAtCheckpoint(
        true
      );

      return;
    }

    /*
     * ==================================================
     * LIVES REMAIN
     * ==================================================
     *
     * SAME POSITION.
     */

    this.comic.show(
      `${label} HIT — ${this.state.lives} LIVES LEFT`,
      900
    );

    this.respawnAtCurrentPosition(
      this.player.x,
      this.player.y
    );
  }

  /*
   * ==================================================
   * FALL DAMAGE
   * ==================================================
   */

  takeDamage({
    deathX = this.lastSafeX,
    deathY = this.lastSafeY,
  } = {}) {
    if (
      this.finished ||
      this.respawning ||
      this.time.now <
        this.lastHitAt
    ) {
      return;
    }

    this.lastHitAt =
      this.time.now + 1100;

    this.lifeSystem.loseLife();

    this.state.lives =
      this.lifeSystem.lives;

    this.player.hit();

    AudioManager.play(
      'hit'
    );

    if (
      this.state.lives <= 0
    ) {
      this.respawnAtCheckpoint(
        true
      );

      return;
    }

    /*
     * A fall uses the last safe ground position.
     */
    this.respawnAtCurrentPosition(
      deathX,
      deathY
    );
  }

  /*
   * ==================================================
   * RESPAWN WITH LIVES REMAINING
   * ==================================================
   */

  respawnAtCurrentPosition(
    x = this.player.x,
    y = this.player.y
  ) {
    if (
      this.finished ||
      this.respawning
    ) {
      return;
    }

    this.respawning =
      true;

    const safeX =
      Phaser.Math.Clamp(
        Number.isFinite(
          Number(x)
        )
          ? Number(x)
          : this.lastSafeX,
        PLAYER_START_X,
        WORLD_WIDTH - 250
      );

    const safeY =
      Number.isFinite(
        Number(y)
      )
        ? Number(y)
        : this.lastSafeY;

    this.player.resetAt(
      safeX,
      safeY,
      1500
    );

    this.lastSafeX =
      safeX;

    this.lastSafeY =
      safeY;

    this.updateHud();

    this.time.delayedCall(
      180,
      () => {
        this.respawning =
          false;
      }
    );
  }

  /*
   * ==================================================
   * CHECKPOINT RESPAWN
   * ==================================================
   *
   * restoreLives = true:
   *
   *     0 lives
   *       ↓
   *     checkpoint
   *       ↓
   *     4 lives
   */

  respawnAtCheckpoint(
    restoreLives = true
  ) {
    if (
      this.finished ||
      this.respawning
    ) {
      return;
    }

    this.respawning =
      true;

    if (
      restoreLives
    ) {
      this.lifeSystem.reset();

      this.state.restoreLives();
    }

    const x =
      Phaser.Math.Clamp(
        this.checkpointX,
        PLAYER_START_X,
        WORLD_WIDTH - 250
      );

    const y =
      Number.isFinite(
        Number(
          this.checkpointY
        )
      )
        ? this.checkpointY
        : PLAYER_START_Y;

    this.player.resetAt(
      x,
      y,
      1800
    );

    this.lastSafeX =
      x;

    this.lastSafeY =
      y;

    /*
     * If Cyber boss mode was active when all lives
     * were lost, remove the boss and return to the
     * saved checkpoint.
     */
    if (
      restoreLives &&
      this.bossMode
    ) {
      this.bossMode =
        false;

      this.boss?.destroy();

      this.boss =
        null;

      this.hud.hideBoss();

      this.bullets.clear(
        true,
        true
      );

      this.bossProjectiles.clear(
        true,
        true
      );
    }

    /*
     * Remove stale objects far behind the checkpoint.
     */
    this.spawner.clearBehind(
      x
    );

    this.cameras.main.stopFollow();

    this.cameras.main.startFollow(
      this.player,
      true,
      0.12,
      0.12,
      -120,
      0
    );

    this.spawner.spawnUntil(
      x
    );

    this.updateHud();

    this.comic.show(
      restoreLives
        ? `CHECKPOINT ${this.checkpointNumber} — 4 LIVES RESTORED`
        : `RESPAWN — ${this.state.lives} LIVES LEFT`,
      restoreLives
        ? 1400
        : 800
    );

    this.time.delayedCall(
      180,
      () => {
        this.respawning =
          false;
      }
    );
  }

  /*
   * ==================================================
   * COIN
   * ==================================================
   */

  onCoin(
    coin
  ) {
    if (
      !coin?.active
    ) {
      return;
    }

    coin.disableBody(
      true,
      true
    );

    this.state.coins +=
      1;

    this.state.score =
      calculateLocalScore(
        this.state
      );

    AudioManager.play(
      'coin'
    );

    this.particles.burst(
      coin.x,
      coin.y,
      6
    );
  }

  /*
   * ==================================================
   * POWERUP
   * ==================================================
   */

  onPowerup(
    powerup
  ) {
    if (
      !powerup?.active
    ) {
      return;
    }

    const type =
      powerup.type;

    powerup.disableBody(
      true,
      true
    );

    if (
      type === 'shield'
    ) {
      this.player.invulnerableUntil =
        this.time.now + 5000;

      this.comic.show(
        'SHIELD ONLINE — 5 SECONDS',
        900
      );
    } else {
      this.player.speed +=
        80;

      this.comic.show(
        'SPEED BOOST — 5 SECONDS',
        900
      );

      this.time.delayedCall(
        5000,
        () => {
          if (
            this.player?.active
          ) {
            this.player.speed =
              Math.max(
                this.config.baseSpeed ||
                  300,
                this.player.speed -
                  80
              );
          }
        }
      );
    }

    this.particles.burst(
      powerup.x,
      powerup.y,
      10
    );
  }

  /*
   * ==================================================
   * CYBER BOSS
   * ==================================================
   */

  startBoss() {
    if (
      this.bossMode
    ) {
      return;
    }

    this.bossMode =
      true;

    this.player.setX(
      CYBER_BOSS_PLAYER_X
    );

    this.player.stop();

    this.boss =
      new Boss(
        this,
        CYBER_BOSS_X,
        485,
        () => this.player,
        () =>
          this.onBossDefeated()
      );

    this.hud.showBoss(
      this.boss.health,
      this.boss.maxHealth
    );

    this.comic.show(
      'FINAL THREAT DETECTED — CYBER BOSS INCOMING',
      1500
    );
  }

  shoot() {
    if (
      !this.bossMode ||
      !this.boss ||
      this.boss.defeated ||
      this.attackCooldown >
        0
    ) {
      return;
    }

    this.attackCooldown =
      260;

    const direction =
      this.boss.x >=
      this.player.x
        ? 1
        : -1;

    const bullet =
      this.bullets.create(
        this.player.x +
          direction * 45,
        this.player.y - 40,
        'tr-boss-shot'
      );

    if (!bullet) {
      return;
    }

    bullet.setVelocity(
      direction * 760,
      0
    );

    bullet.setData(
      'playerBullet',
      true
    );

    this.player.setFlipX(
      direction < 0
    );
  }

  checkBossHits() {
    if (
      !this.boss ||
      this.boss.defeated
    ) {
      return;
    }

    this.bullets.children.each(
      (bullet) => {
        if (
          !bullet?.active ||
          !bullet.getData(
            'playerBullet'
          )
        ) {
          return;
        }

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            bullet.getBounds(),
            this.boss.hitbox.getBounds()
          )
        ) {
          bullet.disableBody(
            true,
            true
          );

          this.boss.damage();

          this.hud.showBoss(
            this.boss.health,
            this.boss.maxHealth
          );
        }
      },
      this
    );
  }

  onBossProjectile(
    projectile
  ) {
    if (
      !projectile?.active
    ) {
      return;
    }

    projectile.disableBody(
      true,
      true
    );

    this.takeDamage({
      deathX:
        this.lastSafeX,

      deathY:
        this.lastSafeY,
    });
  }

  cleanupProjectiles() {
    const cleanup =
      (group) => {
        group?.children.each(
          (item) => {
            if (
              !item?.active
            ) {
              return;
            }

            if (
              item.x <
                this.player.x -
                  1400 ||
              item.x >
                this.player.x +
                  1800 ||
              item.y <
                -150 ||
              item.y >
                GAME_HEIGHT + 250
            ) {
              item.disableBody(
                true,
                true
              );
            }
          },
          this
        );
      };

    cleanup(
      this.bullets
    );

    cleanup(
      this.bossProjectiles
    );
  }

  completeRunnerLevel() {
    if (
      this.finished
    ) {
      return;
    }

    this.finished =
      true;

    this.state.completed =
      true;

    this.state.distance =
      DISTANCE_TARGET;

    this.state.score =
      calculateLocalScore(
        this.state
      );

    this.player.stop();

    AudioManager.play(
      'complete'
    );

    this.comic.show(
      `${this.config.name} COMPLETE`,
      1000
    );

    this.time.delayedCall(
      500,
      () => {
        this.registry.get(
          'onLevelComplete'
        )?.(
          this.state.snapshot()
        );
      }
    );
  }

  onBossDefeated() {
    if (
      this.finished
    ) {
      return;
    }

    this.finished =
      true;

    this.state.completed =
      true;

    this.state.bossDefeated =
      true;

    this.state.distance =
      DISTANCE_TARGET;

    this.state.score =
      calculateLocalScore(
        this.state
      );

    this.hud.hideBoss();

    this.comic.show(
      'BOSS DEFEATED — CYBERSECURITY COMPLETE',
      1500
    );

    this.time.delayedCall(
      900,
      () => {
        this.registry.get(
          'onLevelComplete'
        )?.(
          this.state.snapshot()
        );
      }
    );
  }

  updateHud() {
    this.hud?.update(
      this.state
    );

    if (
      this.bossMode &&
      this.boss
    ) {
      this.hud.showBoss(
        this.boss.health,
        this.boss.maxHealth
      );
    }
  }

  togglePause() {
    if (
      this.finished
    ) {
      return;
    }

    this.paused =
      !this.paused;

    this.physics.world.isPaused =
      this.paused;

    if (
      this.paused
    ) {
      this.player.stop();
    }

    this.comic.show(
      this.paused
        ? 'PAUSED'
        : 'RESUMED',
      600
    );
  }

  cleanup() {
    window.removeEventListener(
      'keydown',
      this.handleKeyDown
    );

    window.removeEventListener(
      'keyup',
      this.handleKeyUp
    );

    window.removeEventListener(
      'blur',
      this.handleBlur
    );

    document.removeEventListener(
      'visibilitychange',
      this.handleBlur
    );

    this.mobile?.destroy();

    this.boss?.destroy();

    this.bullets?.clear(
      true,
      true
    );

    this.bossProjectiles?.clear(
      true,
      true
    );

    this.particles?.destroy();

    this.keyboardState?.clear();
  }
}