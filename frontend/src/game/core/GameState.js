export class GameState {
  constructor(
    level,
    initialLives = 4
  ) {
    this.reset(
      level,
      initialLives
    );
  }

  /*
   * ==================================================
   * RESET
   * ==================================================
   */

  reset(
    level,
    initialLives = 4
  ) {
    this.level =
      level;

    /*
     * ==================================================
     * SCORE
     * ==================================================
     */

    this.score = 0;

    this.coins = 0;

    this.distance = 0;

    this.time = 0;

    this.obstaclesHit = 0;

    /*
     * ==================================================
     * LIVES
     * ==================================================
     */

    this.lives =
      this.clampLives(
        initialLives
      );

    /*
     * ==================================================
     * LEVEL STATUS
     * ==================================================
     */

    this.completed =
      false;

    this.bossDefeated =
      false;

    this.paused =
      false;

    /*
     * ==================================================
     * CHECKPOINT DATA
     * ==================================================
     *
     * These values are also kept inside GameState
     * so the state itself knows where the last safe
     * checkpoint is.
     */

    this.checkpointX =
      220;

    this.checkpointY =
      540;

    this.checkpointDistance =
      0;

    this.checkpointNumber =
      0;

    /*
     * ==================================================
     * LAST SAFE POSITION
     * ==================================================
     */

    this.lastSafeX =
      220;

    this.lastSafeY =
      540;

    /*
     * ==================================================
     * TIMING
     * ==================================================
     */

    this.startedAt =
      typeof performance !==
        'undefined'
        ? performance.now()
        : Date.now();
  }

  /*
   * ==================================================
   * CLAMP LIVES
   * ==================================================
   */

  clampLives(value) {
    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return 4;
    }

    return Math.max(
      0,
      Math.min(
        4,
        Math.floor(number)
      )
    );
  }

  /*
   * ==================================================
   * LOSE LIFE
   * ==================================================
   */

  loseLife() {
    this.lives =
      Math.max(
        0,
        this.lives - 1
      );

    return this.lives;
  }

  /*
   * ==================================================
   * RESTORE LIVES
   * ==================================================
   */

  restoreLives() {
    this.lives = 4;

    return this.lives;
  }

  /*
   * ==================================================
   * SET LIVES
   * ==================================================
   */

  setLives(value) {
    this.lives =
      this.clampLives(
        value
      );

    return this.lives;
  }

  /*
   * ==================================================
   * CHECK LIVES
   * ==================================================
   */

  hasLives() {
    return (
      this.lives > 0
    );
  }

  isGameOver() {
    return (
      this.lives <= 0
    );
  }

  /*
   * ==================================================
   * UPDATE CHECKPOINT
   * ==================================================
   */

  setCheckpoint(
    x,
    y,
    distance,
    number
  ) {
    this.checkpointX =
      Number.isFinite(
        Number(x)
      )
        ? Number(x)
        : this.checkpointX;

    this.checkpointY =
      Number.isFinite(
        Number(y)
      )
        ? Number(y)
        : this.checkpointY;

    this.checkpointDistance =
      Number.isFinite(
        Number(distance)
      )
        ? Number(distance)
        : this.checkpointDistance;

    this.checkpointNumber =
      Number.isFinite(
        Number(number)
      )
        ? Number(number)
        : this.checkpointNumber;

    this.lastSafeX =
      this.checkpointX;

    this.lastSafeY =
      this.checkpointY;
  }

  /*
   * ==================================================
   * UPDATE LAST SAFE POSITION
   * ==================================================
   */

  setLastSafePosition(
    x,
    y
  ) {
    if (
      Number.isFinite(
        Number(x)
      )
    ) {
      this.lastSafeX =
        Number(x);
    }

    if (
      Number.isFinite(
        Number(y)
      )
    ) {
      this.lastSafeY =
        Number(y);
    }
  }

  /*
   * ==================================================
   * CHECKPOINT SNAPSHOT
   * ==================================================
   */

  getCheckpoint() {
    return {
      x:
        this.checkpointX,

      y:
        this.checkpointY,

      distance:
        this.checkpointDistance,

      number:
        this.checkpointNumber,
    };
  }

  /*
   * ==================================================
   * FULL SNAPSHOT
   * ==================================================
   */

  snapshot() {
    return {
      level:
        this.level,

      score:
        this.score,

      coins:
        this.coins,

      distance:
        Math.round(
          this.distance
        ),

      time:
        Math.max(
          0,
          Math.round(
            this.time / 100
          ) / 10
        ),

      obstaclesHit:
        this.obstaclesHit,

      livesRemaining:
        this.lives,

      completed:
        this.completed,

      bossDefeated:
        this.bossDefeated,

      checkpointX:
        this.checkpointX,

      checkpointY:
        this.checkpointY,

      checkpointDistance:
        this.checkpointDistance,

      checkpointNumber:
        this.checkpointNumber,

      lastSafeX:
        this.lastSafeX,

      lastSafeY:
        this.lastSafeY,
    };
  }
}