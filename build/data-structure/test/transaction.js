"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable import/no-extraneous-dependencies */

/* globals describe, it */
process.env.NODE_ENV = 'test';

var chai = require('chai');

var chaiHttp = require('chai-http');

var server = require('../../server');

var transaction = require('../controllers/transaction');

chai.should();
chai.use(chaiHttp);
var expect = chai.expect;

function setTokenHeader(token) {
  return "Bearer ".concat(token);
}

describe('/POST and /GET transactions', function () {
  var token = '';
  it('it should log user in', function (done) {
    var user = {
      email: 'johnwayne@gmail.com',
      password: 'johnwayne'
    };
    chai.request(server).post('/v1/auth/signin').send(user).end(function (err, res) {
      token = setTokenHeader(res.body.data.token);
      res.should.have.a.status(200);
      done();
    });
  });
  describe('/POST credit transactions', function () {
    it('it should create a new credit transaction', function (done) {
      var payload = {
        type: 'credit',
        cashier: 36956655716265,
        amount: 150
      };
      chai.request(server).post("/v1/transactions/".concat(2816408925, "/credit")).set('Authorization', token).send(payload).end(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(err, res) {
          var allTransactions;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return transaction.returnAllTransations();

                case 3:
                  allTransactions = _context.sent;
                  res.should.have.a.status(200);
                  expect(allTransactions.size).to.be.equal(2);
                  expect(res.body.data.accountBalance).to.be.equal('650');
                  done();
                  _context.next = 13;
                  break;

                case 10:
                  _context.prev = 10;
                  _context.t0 = _context["catch"](0);
                  done(_context.t0);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 10]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  });
  describe('/GET transactions', function () {
    it('it should return all transactions and 200 status', function (done) {
      chai.request(server).get('/v1/transactions').set('Authorization', token).end(function (err, res) {
        res.should.have.a.status(200);
        expect(res.body.data.length).to.be.equal(2);
        done();
      });
    });
  });
  describe('/GET transactions', function () {
    it('it should get a specific transaction with an id return and 200 status', function (done) {
      chai.request(server).get('/v1/transactions/61287962375006273000').set('Authorization', token).end(function (err, res) {
        res.should.have.a.status(200);
        expect(res.body.id).to.be.equal(61287962375006273000);
        done();
      });
    });
  });
  describe('/POST debit transactions', function () {
    it('it should create a new debit transaction', function (done) {
      var payload = {
        type: 'debit',
        cashier: 36956655716265,
        amount: 200
      };
      chai.request(server).post("/v1/transactions/".concat(2816408925, "/debit")).set('Authorization', token).send(payload).end(
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(err, res) {
          var allTransactions;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return transaction.returnAllTransations();

                case 3:
                  allTransactions = _context2.sent;
                  res.should.have.a.status(200);
                  expect(allTransactions.size).to.be.equal(3);
                  expect(res.body.data.accountBalance).to.be.equal('450');
                  done();
                  _context2.next = 13;
                  break;

                case 10:
                  _context2.prev = 10;
                  _context2.t0 = _context2["catch"](0);
                  done(_context2.t0);

                case 13:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[0, 10]]);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
    });
  });
});