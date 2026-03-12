import dotenv from 'dotenv';

const ENV = Object.assign(process.env);

export const HTTP_CORS_ALLOWED_ORIGIN = ENV.HTTP_CORS_ALLOWED_ORIGIN ?? '*';
export const HTTP_LISTEN_PORT =
  parseInt(ENV.HTTP_LISTEN_PORT ?? '8080') || 8080;

export const HTTP_API_PREFIX = ENV.HTTP_API_PREFIX ?? '/api/';

export const isProduction = (ENV.ENV ?? '').toLowerCase === 'production';
export const isTest = (ENV.ENV ?? '').toLowerCase === 'test';
export const isDev = !isProduction && !isTest;

export const DEV_SECRET = 'topsecret';
export const SECRET = ENV.SECRET ?? DEV_SECRET;
if (isProduction && SECRET === DEV_SECRET) {
  throw new Error('SECRET env is not set');
} else if (isDev) {
  console.warn('SECRET variable is not set. Using default value');
}

export const STORAGE_DATA_PREFIX = process.env.STORAGE_DATA_PREFIX ?? './data/';
