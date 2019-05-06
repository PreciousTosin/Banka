"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('pg'),
    Pool = _require.Pool;

var dotenv = require('dotenv');

dotenv.config();
var devConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD
};
var prodConfig = {
  connectionString: process.env.DATABASE_URL
};
var pool = new Pool(process.env.NODE_ENV === 'development' ? devConfig : prodConfig);
pool.on('connect', function () {
  console.log("CONNECTED TO ".concat(process.env.DATABASE));
});
/**
 * Create User Table
 */

var createUserTable = function createUserTable() {
  console.log('ABOUT TO CREATE USER TABLE');
  var queryText = "CREATE TABLE IF NOT EXISTS\n      Users(\n        id INTEGER PRIMARY KEY,\n        email VARCHAR(128) UNIQUE NOT NULL,\n        firstName VARCHAR(128) NOT NULL,\n        lastName VARCHAR(128) NOT NULL,\n        password VARCHAR(128) NOT NULL,\n        type VARCHAR(10) NOT NULL,\n        isAdmin BOOLEAN NOT NULL,\n        status VARCHAR(10) NOT NULL\n      )";
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('CREATE USER TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('CREATE USER TABLE ERROR: ', e);
    });
  });
};
/**
 * Create Account Table
 */


var createAccountTable = function createAccountTable() {
  var queryText = "CREATE TABLE IF NOT EXISTS\n      Accounts(\n        id INTEGER PRIMARY KEY,\n        accountNumber INTEGER UNIQUE NOT NULL,\n        createdOn TIMESTAMP WITH TIME ZONE NOT NULL,\n        owner INTEGER NOT NULL,\n        type VARCHAR(20) NOT NULL,\n        status VARCHAR(20) NOT NULL,\n        balance NUMERIC NOT NULL,\n        FOREIGN KEY (owner) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE\n      )";
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('CREATE ACCOUNT TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('CREATE ACCOUNT TABLE ERROR: ', e);
    });
  });
};
/**
 * Create Transaction Table
 */


var createTransactionTable = function createTransactionTable() {
  var queryText = "CREATE TABLE IF NOT EXISTS\n      Transactions(\n        id INTEGER PRIMARY KEY,\n        createdOn TIMESTAMP WITH TIME ZONE NOT NULL,\n        type VARCHAR(20) NOT NULL,\n        accountNumber INTEGER NOT NULL,\n        cashier INTEGER NOT NULL,\n        amount NUMERIC NOT NULL,\n        oldBalance NUMERIC NOT NULL,\n        newBalance NUMERIC NOT NULL,\n        FOREIGN KEY (accountNumber) REFERENCES Accounts (accountNumber) ON DELETE CASCADE ON UPDATE CASCADE\n      )";
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('CREATE TRANSACTION TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('CREATE TRANSACTION TABLE ERROR: ', e);
    });
  });
};
/**
 * Drop User Table
 */


var dropUserTable = function dropUserTable() {
  var queryText = 'DROP TABLE IF EXISTS Users CASCADE';
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('DROP USER TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('DROP USER TABLE ERROR: ', e);
    });
  });
};
/**
 * Drop Account Table
 */


var dropAccountTable = function dropAccountTable() {
  var queryText = 'DROP TABLE IF EXISTS Accounts CASCADE';
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('DROP ACCOUNT TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('DROP ACCOUNT TABLE ERROR: ', e);
    });
  });
};
/**
 * Drop Transaction Table
 */


var dropTransactionTable = function dropTransactionTable() {
  var queryText = 'DROP TABLE IF EXISTS Transactions';
  pool.connect().then(function (client) {
    return client.query(queryText).then(function (res) {
      client.release();
      console.log('DROP TRANSACTION TABLE RESPONSE: ', res);
    })["catch"](function (e) {
      client.release();
      console.log('DROP TRANSACTION TABLE ERROR: ', e);
    });
  });
};
/**
 * Create All Tables
 */


var createAllTables =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return createUserTable();

          case 2:
            _context.next = 4;
            return createAccountTable();

          case 4:
            _context.next = 6;
            return createTransactionTable();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createAllTables() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Drop All Tables
 */


var dropAllTables =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return dropUserTable();

          case 2:
            _context2.next = 4;
            return dropAccountTable();

          case 4:
            _context2.next = 6;
            return dropTransactionTable();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function dropAllTables() {
    return _ref2.apply(this, arguments);
  };
}();

pool.on('remove', function () {
  console.log('CLOSED CLIENT');
  process.exit(0);
});
module.exports = {
  createAccountTable: createAccountTable,
  createUserTable: createUserTable,
  createTransactionTable: createTransactionTable,
  createAllTables: createAllTables,
  dropUserTable: dropUserTable,
  dropAccountTable: dropAccountTable,
  dropTransactionTable: dropTransactionTable,
  dropAllTables: dropAllTables
};

require('make-runnable');