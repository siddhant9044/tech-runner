import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) console.warn(`[ENV] ${key} is not configured. The server will not start until it is set.`);
}

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || '',
  dbName: process.env.DB_NAME || 'tech_runner',
  jwtSecret: process.env.JWT_SECRET || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
