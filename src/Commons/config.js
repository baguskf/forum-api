
import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';
const isTest = ENV === 'test';


const accessTokenAgeRaw =
  process.env.ACCESS_TOKEN_AGE ||
  process.env.ACCCESS_TOKEN_AGE;

if (!accessTokenAgeRaw) {
  throw new Error('ACCESS_TOKEN_AGE is required');
}

const config = {
  app: {
    host: ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },

  database: {
    host: isTest ? process.env.PGHOST_TEST : process.env.PGHOST,
    port: Number(isTest ? process.env.PGPORT_TEST : process.env.PGPORT),
    user: isTest ? process.env.PGUSER_TEST : process.env.PGUSER,
    password: isTest ? process.env.PGPASSWORD_TEST : process.env.PGPASSWORD,
    database: isTest ? process.env.PGDATABASE_TEST : process.env.PGDATABASE,
  },

  auth: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: Number(accessTokenAgeRaw),
  },
};

console.log('ENV:', ENV);
console.log('DB:', config.database.database);

export default config;