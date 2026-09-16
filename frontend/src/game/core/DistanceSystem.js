import { DISTANCE_TARGET } from './GameConfig';
export class DistanceSystem { update(playerX) { return Math.min(DISTANCE_TARGET, Math.max(0, (playerX - 200) / 10)); } }
