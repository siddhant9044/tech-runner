export class LifeSystem {
  constructor(
    initialLives = 4
  ) {
    this.maxLives = 4;

    this.lives =
      this.clamp(
        initialLives
      );
  }

  /*
   * ==================================================
   * CLAMP LIVES
   * ==================================================
   */

  clamp(value) {
    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return this.maxLives;
    }

    return Math.max(
      0,
      Math.min(
        this.maxLives,
        Math.floor(number)
      )
    );
  }

  /*
   * ==================================================
   * LOSE ONE LIFE
   * ==================================================
   */

  loseLife() {
    if (
      this.lives <= 0
    ) {
      return 0;
    }

    this.lives =
      Math.max(
        0,
        this.lives - 1
      );

    return this.lives;
  }

  /*
   * ==================================================
   * RESTORE ALL LIVES
   * ==================================================
   *
   * Used when:
   *
   * Cyber:
   *   0 lives -> checkpoint -> 4 lives
   *
   * Cloud/WebDev/AI:
   *   0 lives -> level restart -> 4 lives
   */

  reset() {
    this.lives =
      this.maxLives;

    return this.lives;
  }

  /*
   * ==================================================
   * CHECKPOINT RESET
   * ==================================================
   */

  resetForCheckpoint() {
    return this.reset();
  }

  /*
   * ==================================================
   * CYBER RESET
   * ==================================================
   *
   * Kept for compatibility with the existing
   * GameScene code.
   */

  resetForCyber() {
    return this.reset();
  }

  /*
   * ==================================================
   * SET LIVES
   * ==================================================
   *
   * Useful when restoring a specific state.
   */

  setLives(value) {
    this.lives =
      this.clamp(value);

    return this.lives;
  }

  /*
   * ==================================================
   * HAS LIVES
   * ==================================================
   */

  hasLives() {
    return (
      this.lives > 0
    );
  }

  /*
   * ==================================================
   * NO LIVES LEFT
   * ==================================================
   */

  isEmpty() {
    return (
      this.lives <= 0
    );
  }

  /*
   * ==================================================
   * GET CURRENT LIVES
   * ==================================================
   */

  getLives() {
    return this.lives;
  }

  /*
   * ==================================================
   * GET MAX LIVES
   * ==================================================
   */

  getMaxLives() {
    return this.maxLives;
  }

  /*
   * ==================================================
   * SNAPSHOT
   * ==================================================
   */

  snapshot() {
    return {
      lives:
        this.lives,

      maxLives:
        this.maxLives,

      hasLives:
        this.hasLives(),
    };
  }
}