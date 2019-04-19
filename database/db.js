const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const devConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
};

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);

pool.on('connect', () => {
  console.log(`CONNECTED TO ${process.env.DATABASE}`);
});

/**
 * Create User Table
 */
const createUserTable = () => {
  console.log('ABOUT TO CREATE USER TABLE');
  const queryText = `CREATE TABLE IF NOT EXISTS
      Users(
        id INTEGER PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        firstName VARCHAR(128) NOT NULL,
        lastName VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10) NOT NULL,
        isAdmin BOOLEAN NOT NULL,
        status VARCHAR(20) NOT NULL
      )`;

  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('CREATE USER TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('CREATE USER TABLE ERROR: ', e);
      }));
};

/**
 * Create Account Table
 */
const createAccountTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      Accounts(
        id INTEGER PRIMARY KEY,
        accountNumber INTEGER NOT NULL,
        createdOn TIMESTAMP WITH TIME ZONE NOT NULL,
        owner INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        balance NUMERIC NOT NULL,
        FOREIGN KEY (owner) REFERENCES Users (id) ON DELETE CASCADE
      )`;

  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('CREATE ACCOUNT TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('CREATE ACCOUNT TABLE ERROR: ', e);
      }));
};

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Users CASCADE';
  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('DROP USER TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('DROP USER TABLE ERROR: ', e);
      }));
};

/**
 * Drop Account Table
 */
const dropAccountTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Accounts CASCADE';
  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('CREATE USER TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('CREATE USER TABLE ERROR: ', e);
      }));
};

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createAccountTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropAccountTable();
};

pool.on('remove', () => {
  console.log('CLOSED CLIENT');
  process.exit(0);
});


module.exports = {
  createAccountTable,
  createUserTable,
  createAllTables,
  dropUserTable,
  dropAccountTable,
  dropAllTables,
};

require('make-runnable');
