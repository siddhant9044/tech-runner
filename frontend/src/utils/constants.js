export const LEVELS = [
  { key: 'cloud', path: '/game/cloud', name: 'CLOUD COMPUTING', short: 'Cloud', color: '#36b8ff' },
  { key: 'webdev', path: '/game/webdev', name: 'WEB DEVELOPMENT', short: 'Web Dev', color: '#52d5ff' },
  { key: 'aiml', path: '/game/aiml', name: 'AI / MACHINE LEARNING', short: 'AI/ML', color: '#79e3ff' },
  { key: 'cyber', path: '/game/cyber', name: 'CYBERSECURITY', short: 'Cyber', color: '#ff3d4e' },
];
export const BRANCHES = [
  'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics Engineering',
  'Computer Science and Engineering (CSE)', 'Information Technology (IT)', 'Robotics and Automation',
  'Artificial Intelligence and Machine Learning (AI & ML)',
];
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const WS_URL = (import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000').replace(/\/$/, '');
export const DISTANCE_TARGET = 1200;
