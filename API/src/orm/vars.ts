export let DB_SSL = false;
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_SSL')) {
  DB_SSL = process.env.DB_SSL !== '0' && process.env.DB_SSL !== '';
}

export let DB_PATH = process.env.DB_PATH as string;
if (!DB_PATH) {
  console.warn(
    "No DB_OATH variable set. Using 'psql://0.0.0.0:5432/test' instead"
  );
  DB_PATH = 'psql://0.0.0.0:5432/test';
}

export let DB_LOGGING = false;
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_LOGGING')) {
  DB_LOGGING = process.env.DB_LOGGING !== '0' && process.env.DB_LOGGING !== '';
}

export const DB_POOL_ACQUIRE_TIME = 60000;
export const DB_POOL_IDLE_TIME = 10000;
export const DB_POOL_MAX_CONNECTIONS = 50;
