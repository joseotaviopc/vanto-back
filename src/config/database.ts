// @deno-types="npm:@types/mysql"
import mysql from 'mysql';
import { host, database, user, port } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

class DatabasePool {
  private pool: mysql.Pool;
  private retryCount: number = 0;
  private isConnected: boolean = false;

  constructor() {
    this.pool = this.createPool();
    this.initializePool();
  }

  private createPool(): mysql.Pool {
    return mysql.createPool({
      connectionLimit: 10,
      host,
      user,
      password: '4v8$HkH9Tv',
      port,
      database,
      waitForConnections: true,
      queueLimit: 0,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      multipleStatements: false,
      debug: false,
    });
  }

  private async initializePool() {
    try {
      await this.testConnection();
      this.isConnected = true;
      this.retryCount = 0;
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Failed to initialize database connection:', error);
      await this.handleConnectionError();
    }
  }

  private async testConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        connection.release();
        resolve();
      });
    });
  }

  private async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(`Retrying database connection (attempt ${this.retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      this.pool = this.createPool();
      await this.initializePool();
    } else {
      console.error(`Failed to connect to database after ${MAX_RETRIES} attempts`);
      // throw new Error('Database connection failed');
    }
  }

  public async query<T>(sql: string, values?: any): Promise<T> {
    if (!this.isConnected) {
      await this.initializePool();
    }

    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, async (error, results) => {
        if (error) {
          if (this.isConnectionError(error)) {
            this.isConnected = false;
            try {
              await this.handleConnectionError();
              // Retry the query once after reconnecting
              this.pool.query(sql, values, (retryError, retryResults) => {
                if (retryError) {
                  reject(retryError);
                } else {
                  resolve(retryResults);
                }
              });
            } catch (reconnectError) {
              reject(reconnectError);
            }
          } else {
            reject(error);
          }
        } else {
          resolve(results);
        }
      });
    });
  }

  private isConnectionError(error: any): boolean {
    return [
      'PROTOCOL_CONNECTION_LOST',
      'ECONNRESET',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'PROTOCOL_SEQUENCE_TIMEOUT',
      'ENOTFOUND'
    ].includes(error.code);
  }

  public async getConnection(): Promise<mysql.PoolConnection> {
    if (!this.isConnected) {
      await this.initializePool();
    }

    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(connection);
      });
    });
  }

  public async end(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

const databasePool = new DatabasePool();

export const query = <T>(sql: string, values?: any): Promise<T> => {
  return databasePool.query<T>(sql, values);
};

export const getConnection = (): Promise<mysql.PoolConnection> => {
  return databasePool.getConnection();
};

export default databasePool;
