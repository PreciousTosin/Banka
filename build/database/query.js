"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = _interopRequireDefault(require("pg"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Pool = _pg["default"].Pool;

_dotenv["default"].config();

var devConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD
}; // eslint-disable-next-line no-unused-vars

var prodConfig = {
  connectionString: process.env.DATABASE_URL
};
var pool = new Pool(process.env.NODE_ENV === 'development' ? devConfig : prodConfig);
var _default = {
  query: function query(text) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return new Promise(function (resolve, reject) {
      pool.query(text, params).then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        reject(err);
      });
    });
  },
  transaction: function transaction(queryOne, queryTwo) {
    var queryOneResults = '';
    var queryTwoResults = '';
    return new Promise(function (resolve, reject) {
      pool.query('BEGIN').then(function () {
        return queryOne();
      }).then(function (one) {
        queryOneResults = one;
        return queryTwo();
      }).then(function (two) {
        queryTwoResults = two;
        return pool.query('COMMIT');
      }).then(function () {
        return resolve([queryOneResults, queryTwoResults]);
      })["catch"](function (error) {
        return pool.query('ROLLBACK')["catch"](function (err) {
          return reject(err);
        }).then(function () {
          console.log('ROLLBACK ERROR: ', error);
          reject(error);
        });
      });
    });
  }
};
exports["default"] = _default;