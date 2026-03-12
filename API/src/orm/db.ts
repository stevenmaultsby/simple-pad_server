import {Sequelize} from 'sequelize';
import {URL} from 'url';

import {
  DB_PATH,
  DB_LOGGING,
  DB_POOL_ACQUIRE_TIME,
  DB_POOL_IDLE_TIME,
  DB_POOL_MAX_CONNECTIONS,
  DB_SSL,
} from './vars';

class DB {
  connection: Sequelize;
  constructor(
    private dbUrl: string,
    private useSSL: boolean = false
  ) {
    const url = new URL(this.dbUrl);
    this.connection = new Sequelize(
      decodeURI(url.pathname.replace(/^\//, '')),
      decodeURI(url.username),
      decodeURI(url.password),
      {
        host: decodeURI(url.hostname),
        port: parseInt(url.port),
        dialect: 'postgres',
        timezone: 'utc',
        dialectOptions: {
          ssl: this.useSSL
            ? {
                require: true,
                rejectUnauthorized: false,
              }
            : undefined,
        },
        logging: DB_LOGGING ? console.log : false,
        pool: {
          max: DB_POOL_MAX_CONNECTIONS,
          min: 0,
          idle: DB_POOL_IDLE_TIME,
          acquire: DB_POOL_ACQUIRE_TIME,
        },
      }
    );
  }
  get sequelize(): Sequelize {
    return this.connection;
  }
  async connect(): Promise<void> {
    return this.connection.authenticate();
  }
}

export const dbConnection = new DB(DB_PATH, DB_SSL);
