const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    trustedConnection: process.env.DB_TRUSTED_CONNECTION === 'true' || true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
    encrypt: process.env.DB_ENCRYPT === 'true' || true,
  },
};

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      if (!this.pool) {
        this.pool = await new sql.ConnectionPool(config).connect();
        console.log('Connected to SQL Server');
      }
      return this.pool;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        console.log('Disconnected from MSSQL database');
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  async query(queryString, inputs = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      // Add input parameters
      Object.keys(inputs).forEach(key => {
        request.input(key, inputs[key]);
      });

      const result = await request.query(queryString);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async execute(procedureName, inputs = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();

      // Add input parameters
      Object.keys(inputs).forEach(key => {
        request.input(key, inputs[key]);
      });

      const result = await request.execute(procedureName);
      return result;
    } catch (error) {
      console.error('Database procedure execution error:', error);
      throw error;
    }
  }
}

module.exports = new Database();
