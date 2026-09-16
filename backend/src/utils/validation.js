export const BRANCHES = [
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Robotics and Automation',
  'Artificial Intelligence and Machine Learning (AI & ML)',
];

export const LEVELS = ['cloud', 'webdev', 'aiml', 'cyber'];
export const DISTANCE_TARGET = 1200;

export function cleanText(value, max = 120) {
  return String(value ?? '').trim().replace(/[<>]/g, '').slice(0, max);
}

export function assertBranch(branch) {
  if (!BRANCHES.includes(branch)) throw Object.assign(new Error('Invalid engineering branch'), { statusCode: 400 });
}

export function assertLevel(level) {
  if (!LEVELS.includes(level)) throw Object.assign(new Error('Invalid level'), { statusCode: 400 });
}

export function finiteNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function nonNegative(value, max = Number.MAX_SAFE_INTEGER) {
  return Math.min(max, Math.max(0, finiteNumber(value)));
}
