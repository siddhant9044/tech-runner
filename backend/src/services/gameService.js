import { GameSession } from '../models/GameSession.js';
import { LevelScore } from '../models/LevelScore.js';
import { Player } from '../models/Player.js';
import { Leaderboard } from '../models/Leaderboard.js';

import { generateSessionId } from '../utils/generateSessionId.js';

import {
  LEVELS,
  DISTANCE_TARGET,
  assertLevel,
  nonNegative,
} from '../utils/validation.js';

import {
  calculateLevelScore,
  calculateTotals,
} from '../utils/calculateFinalScore.js';


const idx = (level) =>
  LEVELS.indexOf(level);


/*
 * Create a new game session.
 *
 * Cloud remains the default progress marker,
 * but it is NO LONGER used to lock the other
 * domains.
 */
export async function createSession(
  playerId
) {
  const player =
    await Player.findById(
      playerId
    );

  if (!player) {
    throw Object.assign(
      new Error(
        'Player not found'
      ),
      {
        statusCode: 404,
      }
    );
  }

  const session =
    await GameSession.create({
      sessionId:
        generateSessionId(),

      playerId,

      currentLevel:
        'cloud',

      status:
        'READY',
    });

  return session;
}


/*
 * Get the player's game session.
 */
export async function getSession(
  sessionId,
  playerId
) {
  const session =
    await GameSession.findOne({
      sessionId,
      playerId,
    });

  if (!session) {
    throw Object.assign(
      new Error(
        'Game session not found'
      ),
      {
        statusCode: 404,
      }
    );
  }

  return session;
}


/*
 * Start ANY level.
 *
 * IMPORTANT:
 *
 * There is intentionally NO check like:
 *
 * requested !== expected
 *
 * Therefore the player can start:
 *
 * cloud
 * webdev
 * aiml
 * cyber
 *
 * in any order.
 */
export async function startLevel({
  sessionId,
  playerId,
  level,
}) {
  assertLevel(level);

  const session =
    await getSession(
      sessionId,
      playerId
    );

  const requested =
    idx(level);

  /*
   * Do not allow a completely finished
   * session to be restarted automatically.
   *
   * The normal flow ends after Cyber.
   */
  if (
    session.status ===
    'COMPLETED'
  ) {
    throw Object.assign(
      new Error(
        'This game session is already complete'
      ),
      {
        statusCode: 409,
      }
    );
  }

  const existing =
    session.levels.find(
      (item) =>
        item.level === level
    );

  /*
   * A completed level is not "locked".
   *
   * It simply remains completed and is
   * available as historical result.
   *
   * We prevent accidental overwrite from
   * starting the same completed level again
   * inside the same session.
   */
  if (
    existing?.completed
  ) {
    throw Object.assign(
      new Error(
        'This level is already completed in the current game session'
      ),
      {
        statusCode: 409,
      }
    );
  }

  const startedAt =
    new Date();

  /*
   * Lives:
   *
   * Cyber always starts with 4 lives.
   *
   * For the other domains:
   *
   * - If the immediately previous domain
   *   has been completed, carry its remaining
   *   lives.
   *
   * - If the player selected a domain directly
   *   without completing its previous domain,
   *   start with 4.
   *
   * This preserves the original life-carry
   * behavior while allowing free level choice.
   */

  const previousLevel =
    LEVELS[requested - 1];

  const previous =
    previousLevel
      ? session.levels.find(
          (item) =>
            item.level ===
            previousLevel &&
            item.completed
        )
      : null;

  const initialLives =
    level === 'cyber'
      ? 4
      : Math.min(
          4,
          Math.max(
            0,
            Number(
              previous?.livesRemaining ??
                4
            )
          )
        );

  /*
   * If this level already has an unfinished
   * record, restart it cleanly.
   *
   * Otherwise create a new level record.
   */

  if (existing) {
    existing.startedAt =
      startedAt;

    existing.completed =
      false;

    existing.livesRemaining =
      initialLives;

    existing.completedAt =
      undefined;

    existing.score =
      0;

    existing.coins =
      0;

    existing.distance =
      0;

    existing.time =
      0;

    existing.obstaclesHit =
      0;

    existing.bossDefeated =
      false;
  } else {
    session.levels.push({
      level,

      startedAt,

      completed: false,

      livesRemaining:
        initialLives,

      score: 0,

      coins: 0,

      distance: 0,

      time: 0,

      obstaclesHit: 0,

      bossDefeated: false,
    });
  }

  /*
   * currentLevel is now only a progress marker.
   *
   * It is NOT used to decide whether a level
   * can be played.
   */
  session.currentLevel =
    level;

  session.status =
    'ACTIVE';

  await session.save();

  return {
    sessionId,

    level,

    initialLives,

    startedAt,
  };
}


/*
 * Complete ANY level.
 *
 * There is no sequential-level check.
 */
export async function completeLevel({
  sessionId,
  playerId,
  level,
  result,
}) {
  assertLevel(level);

  const session =
    await getSession(
      sessionId,
      playerId
    );

  const existing =
    session.levels.find(
      (item) =>
        item.level === level
    );

  /*
   * The level must have been started
   * in this session.
   */
  if (!existing) {
    throw Object.assign(
      new Error(
        'Start this level before completing it'
      ),
      {
        statusCode: 409,
      }
    );
  }

  const distance =
    nonNegative(
      result.distance,
      DISTANCE_TARGET
    );

  const completed =
    Boolean(result.completed) &&
    distance >=
      DISTANCE_TARGET;

  if (!completed) {
    throw Object.assign(
      new Error(
        `Level must reach ${DISTANCE_TARGET} distance units before completion`
      ),
      {
        statusCode: 400,
      }
    );
  }

  const time =
    nonNegative(
      result.time,
      3600
    );

  const coins =
    nonNegative(
      result.coins,
      80
    );

  const obstaclesHit =
    nonNegative(
      result.obstaclesHit,
      100
    );

  if (coins > 80) {
    throw Object.assign(
      new Error(
        'Coin count exceeds the validated per-level limit'
      ),
      {
        statusCode: 400,
      }
    );
  }

  if (
    obstaclesHit > 100
  ) {
    throw Object.assign(
      new Error(
        'Obstacle-hit count is outside the accepted range'
      ),
      {
        statusCode: 400,
      }
    );
  }

  const livesRemaining =
    Math.min(
      4,
      Math.max(
        0,
        Math.round(
          nonNegative(
            result.livesRemaining,
            4
          )
        )
      )
    );

  /*
   * Cyber has an additional server-side
   * completion requirement.
   */
  const bossDefeated =
    level === 'cyber' &&
    Boolean(
      result.bossDefeated
    );

  if (
    level === 'cyber' &&
    !bossDefeated
  ) {
    throw Object.assign(
      new Error(
        'Cyber level requires the boss to be defeated'
      ),
      {
        statusCode: 400,
      }
    );
  }

  /*
   * Calculate the authoritative level score
   * on the server.
   */
  const score =
    calculateLevelScore({
      distance:
        DISTANCE_TARGET,

      coins,

      obstaclesHit,

      livesRemaining,

      bossDefeated,
    });

  const levelData = {
    level,

    startedAt:
      existing.startedAt ||
      new Date(),

    completedAt:
      new Date(),

    completed: true,

    score,

    coins:
      Math.round(coins),

    distance:
      DISTANCE_TARGET,

    time:
      Math.round(
        time * 100
      ) / 100,

    obstaclesHit:
      Math.round(
        obstaclesHit
      ),

    livesRemaining,

    bossDefeated,
  };

  /*
   * Store the authoritative level score
   * in MongoDB.
   */
  await LevelScore.findOneAndUpdate(
    {
      sessionId,
      level,
    },
    {
      $set: {
        playerId,
        ...levelData,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  /*
   * Update the session's level record.
   */
  const replacement =
    session.levels.findIndex(
      (item) =>
        item.level === level
    );

  if (
    replacement >= 0
  ) {
    session.levels[
      replacement
    ] = levelData;
  } else {
    session.levels.push(
      levelData
    );
  }

  /*
   * Calculate totals from every stored
   * completed level.
   */
  const totals =
    calculateTotals(
      session.levels
    );

  session.totalScore =
    totals.totalScore;

  session.totalCoins =
    totals.totalCoins;

  session.totalDistance =
    totals.totalDistance;

  session.totalTime =
    totals.totalTime;

  session.totalObstaclesHit =
    totals.totalObstaclesHit;

  /*
   * Determine whether all four domains
   * are completed.
   */
  const allLevelsCompleted =
    LEVELS.every(
      (requiredLevel) =>
        session.levels.some(
          (item) =>
            item.level ===
              requiredLevel &&
            item.completed ===
              true
        )
    );

  if (allLevelsCompleted) {
    /*
     * All four domains are complete.
     */
    session.currentLevel =
      'cyber';

    session.status =
      'COMPLETED';

    session.completedAt =
      session.completedAt ||
      new Date();

    session.bossDefeated =
      Boolean(
        session.levels.find(
          (item) =>
            item.level ===
              'cyber' &&
            item.bossDefeated
        )
      );

    await session.save();

    /*
     * Only after all four domains are
     * completed do we sync the final
     * leaderboard entry.
     */
    await syncLeaderboard(
      session
    );

    return {
      level: levelData,

      session:
        session.toObject(),

      final: true,
    };
  }

  /*
   * There are still domains remaining.
   *
   * Keep session active/ready.
   *
   * currentLevel is updated only as a
   * progress indicator, not as a lock.
   */
  const nextUncompleted =
    LEVELS.find(
      (requiredLevel) =>
        !session.levels.some(
          (item) =>
            item.level ===
              requiredLevel &&
            item.completed ===
              true
        )
    );

  session.currentLevel =
    nextUncompleted ||
    level;

  session.status =
    'READY';

  await session.save();

  return {
    level: levelData,

    session:
      session.toObject(),

    final: false,

    nextLevel:
      nextUncompleted ||
      null,
  };
}


/*
 * Record game over.
 */
export async function recordGameOver({
  sessionId,
  playerId,
  level,
  result,
}) {
  assertLevel(level);

  const session =
    await getSession(
      sessionId,
      playerId
    );

  const current =
    session.levels.find(
      (item) =>
        item.level === level
    );

  if (current) {
    current.livesRemaining =
      0;
  }

  /*
   * Do not destroy the entire session
   * progress if the player loses one domain.
   *
   * Other completed domains remain stored.
   */
  session.status =
    'GAME_OVER';

  await session.save();

  return session;
}


/*
 * Synchronize final leaderboard.
 *
 * Leaderboard values are taken from
 * MongoDB session data, not from frontend
 * supplied rank/order.
 */
async function syncLeaderboard(
  session
) {
  const player =
    await Player.findById(
      session.playerId
    );

  if (!player) {
    throw Object.assign(
      new Error(
        'Player not found while syncing leaderboard'
      ),
      {
        statusCode: 404,
      }
    );
  }

  const levels =
    Object.fromEntries(
      session.levels.map(
        (item) => [
          item.level,
          item,
        ]
      )
    );

  const candidate = {
    playerId:
      player._id,

    player:
      player.name,

    branch:
      player.branch,

    cloud:
      levels.cloud?.score ||
      0,

    webDev:
      levels.webdev?.score ||
      0,

    aiml:
      levels.aiml?.score ||
      0,

    cyber:
      levels.cyber?.score ||
      0,

    totalScore:
      session.totalScore,

    coins:
      session.totalCoins,

    time:
      session.totalTime,

    distance:
      session.totalDistance,

    obstaclesHit:
      session.totalObstaclesHit,

    bossDefeated:
      true,

    sessionId:
      session.sessionId,

    completedAt:
      session.completedAt ||
      new Date(),
  };

  const current =
    await Leaderboard.findOne({
      playerId:
        player._id,
    });

  /*
   * Keep the player's better result.
   */
  if (
    !current ||
    compareCandidate(
      candidate,
      current
    ) < 0
  ) {
    await Leaderboard.findOneAndUpdate(
      {
        playerId:
          player._id,
      },
      {
        $set:
          candidate,
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
}


/*
 * Compare two final leaderboard
 * candidates.
 *
 * Higher score wins.
 * Then higher coins.
 * Then lower time.
 * Then higher distance.
 * Then fewer obstacle hits.
 *
 * This is only comparison logic.
 * Rank itself should remain server-side.
 */
function compareCandidate(
  a,
  b
) {
  return (
    b.totalScore -
      a.totalScore ||

    b.coins -
      a.coins ||

    a.time -
      b.time ||

    b.distance -
      a.distance ||

    a.obstaclesHit -
      b.obstaclesHit
  );
}


/*
 * Finalize session.
 */
export async function finalizeSession({
  sessionId,
  playerId,
}) {
  const session =
    await getSession(
      sessionId,
      playerId
    );

  if (
    session.status !==
    'COMPLETED'
  ) {
    throw Object.assign(
      new Error(
        'Complete all four levels before finalizing'
      ),
      {
        statusCode: 409,
      }
    );
  }

  return session;
}