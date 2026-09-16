export function calculateLevelScore({ distance, coins, obstaclesHit, livesRemaining, bossDefeated = false }) {
  const base = Math.round(Math.max(0, distance) * 1.5);
  const coinPoints = Math.round(Math.max(0, coins) * 25);
  const survival = Math.round(Math.max(0, livesRemaining) * 50);
  const hitPenalty = Math.round(Math.max(0, obstaclesHit) * 35);
  const bossBonus = bossDefeated ? 1000 : 0;
  return Math.max(0, base + coinPoints + survival - hitPenalty + bossBonus);
}

export function calculateTotals(levels) {
  return levels.reduce((acc, level) => {
    acc.totalScore += level.score;
    acc.totalCoins += level.coins;
    acc.totalDistance += level.distance;
    acc.totalTime += level.time;
    acc.totalObstaclesHit += level.obstaclesHit;
    return acc;
  }, { totalScore: 0, totalCoins: 0, totalDistance: 0, totalTime: 0, totalObstaclesHit: 0 });
}
