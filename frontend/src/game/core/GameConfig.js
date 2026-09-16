/*
 * ==================================================
 * TECH RUNNER GLOBAL GAME CONFIGURATION
 * ==================================================
 */

export const GAME_WIDTH = 1280;

export const GAME_HEIGHT = 720;

/*
 * Entire playable world.
 */
export const WORLD_WIDTH = 13200;

/*
 * Top of the main ground.
 */
export const GROUND_Y = 630;

/*
 * Player starting position.
 */
export const PLAYER_START_X = 220;

export const PLAYER_START_Y = 540;

/*
 * ==================================================
 * LIVES
 * ==================================================
 *
 * Every domain uses:
 *
 * 4 lives at the beginning.
 *
 * Hit while lives remain:
 *   continue from current/death position.
 *
 * 0 lives:
 *   teleport to latest checkpoint.
 *   restore 4 lives.
 */

export const MAX_LIVES = 4;

/*
 * ==================================================
 * CHECKPOINT
 * ==================================================
 *
 * A checkpoint is created every 300 distance units.
 */

export const CHECKPOINT_INTERVAL = 300;

/*
 * ==================================================
 * LEVEL DISTANCE
 * ==================================================
 */

export const DISTANCE_TARGET = 1200;

/*
 * ==================================================
 * LEVEL END
 * ==================================================
 */

export const LEVEL_COMPLETE_X = 12200;

/*
 * ==================================================
 * CYBER BOSS
 * ==================================================
 */

export const CYBER_BOSS_TRIGGER_X = 11200;

export const CYBER_BOSS_PLAYER_X = 10800;

export const CYBER_BOSS_X = 11950;

/*
 * ==================================================
 * PHYSICS
 * ==================================================
 */

export const GRAVITY_Y = 1100;

/*
 * ==================================================
 * PLAYER
 * ==================================================
 */

export const PLAYER_SPEED = 300;

export const PLAYER_BOSS_SPEED = 330;

export const PLAYER_JUMP_VELOCITY = 570;

/*
 * ==================================================
 * DAMAGE / RESPAWN
 * ==================================================
 */

export const HIT_COOLDOWN = 1100;

export const NORMAL_RESPAWN_INVULNERABILITY =
  1500;

export const CHECKPOINT_RESPAWN_INVULNERABILITY =
  1800;

export const LEVEL_RESTART_INVULNERABILITY =
  1800;

/*
 * ==================================================
 * FALL LIMIT
 * ==================================================
 */

export const PLAYER_FALL_Y = 760;