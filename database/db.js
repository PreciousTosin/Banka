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

const pool = new Pool(process.env.NODE_ENV === 'development' ? devConfig : prodConfig);

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
        status VARCHAR(10) NOT NULL
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
 * Create Tokens Table
 */
const createTokensTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      Tokens(
        owner INTEGER NOT NULL,
        token VARCHAR(500),
        FOREIGN KEY (owner) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
      )`;

  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('CREATE TOKENS TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('CREATE TOKENS TABLE ERROR: ', e);
      }));
};

/**
 * Create Account Table
 */
const createAccountTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      Accounts(
        id INTEGER PRIMARY KEY,
        accountNumber INTEGER UNIQUE NOT NULL,
        createdOn TIMESTAMP WITH TIME ZONE NOT NULL,
        owner INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        balance NUMERIC NOT NULL,
        FOREIGN KEY (owner) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE
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
 * Create Transaction Table
 */
const createTransactionTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      Transactions(
        id INTEGER PRIMARY KEY,
        createdOn TIMESTAMP WITH TIME ZONE NOT NULL,
        type VARCHAR(20) NOT NULL,
        accountNumber INTEGER NOT NULL,
        cashier INTEGER NOT NULL,
        amount NUMERIC NOT NULL,
        oldBalance NUMERIC NOT NULL,
        newBalance NUMERIC NOT NULL,
        FOREIGN KEY (accountNumber) REFERENCES Accounts (accountNumber) ON DELETE CASCADE ON UPDATE CASCADE
      )`;

  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('CREATE TRANSACTION TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('CREATE TRANSACTION TABLE ERROR: ', e);
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
 * Drop Tokens Table
 */
const dropTokensTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Tokens CASCADE';
  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('DROP TOKENS TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('DROP TOKENS TABLE ERROR: ', e);
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
        console.log('DROP ACCOUNT TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('DROP ACCOUNT TABLE ERROR: ', e);
      }));
};

/**
 * Drop Transaction Table
 */
const dropTransactionTable = () => {
  const queryText = 'DROP TABLE IF EXISTS Transactions';
  pool.connect()
    .then(client => client.query(queryText)
      .then((res) => {
        client.release();
        console.log('DROP TRANSACTION TABLE RESPONSE: ', res);
      })
      .catch((e) => {
        client.release();
        console.log('DROP TRANSACTION TABLE ERROR: ', e);
      }));
};

/**
 * Create All Tables
 */
const createAllTables = async () => {
  await createUserTable();
  await createAccountTable();
  await createTransactionTable();
  await createTokensTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = async () => {
  await dropUserTable();
  await dropAccountTable();
  await dropTransactionTable();
  await dropTokensTable();
};

pool.on('remove', () => {
  console.log('CLOSED CLIENT');
  process.exit(0);
});


module.exports = {
  createAccountTable,
  createUserTable,
  createTransactionTable,
  createTokensTable,
  createAllTables,
  dropUserTable,
  dropTokensTable,
  dropAccountTable,
  dropTransactionTable,
  dropAllTables,
};

require('make-runnable');
