"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable import/no-extraneous-dependencies */

/* globals describe, it */
process.env.NODE_ENV = 'test';

var chai = require('chai');

var chaiHttp = require('chai-http');

var server = require('../../server');

chai.should();
chai.use(chaiHttp);
var expect = chai.expect;

var account = require('../controllers/account');

function setTokenHeader(token) {
  return "Bearer ".concat(token);
}

describe('/POST accounts', function () {
  var newAccount = {
    id: 12586085672261283,
    accountNumber: 2560905761,
    createdOn: new Date(Date.now()),
    owner: 36956655716265,
    type: 'savings',
    status: 'draft',
    balance: 0.00
  };
  it('it should create account and return status of 200', function (done) {
    chai.request(server).post('/v1/accounts').send(newAccount).end(function (err, res) {
      res.should.have.a.status(200);
      done();
    });
  });
});
describe('/GET AND /PATCH acccounts', function () {
  var token = '';
  it('it should log user in', function (done) {
    var user = {
      email: 'tylerross@gmail.com',
      password: 'tylerross'
    };
    chai.request(server).post('/v1/auth/signin').send(user).end(function (err, res) {
      token = setTokenHeader(res.body.data.token);
      res.should.have.a.status(200);
      done();
    });
  });
  describe('/GET accounts', function () {
    it('it should retrieve all accounts and return status of 200', function (done) {
      chai.request(server).get('/v1/accounts').set('Authorization', token).end(function (err, res) {
        res.should.have.a.status(200);
        expect(res.body).to.have.lengthOf(3);
        done();
      });
    });
  });
  describe('/PATCH accounts', function () {
    it('it should patch account and return status of 200', function (done) {
      chai.request(server).patch("/v1/accounts/".concat(2869502843)).set('Authorization', token).send({
        status: 'active'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res).to.have.status(200);
        expect(res.body.data.status).to.be.equal('active');
        done();
      });
    });
  });
  describe('/DELETE accounts', function () {
    it('it should delete account', function (done) {
      chai.request(server)["delete"]("/v1/accounts/".concat(2869502843)).set('Authorization', token).end(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(err, res) {
          var userAccount, allAccounts;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return account.getUserAccounts(2869502843);

                case 3:
                  userAccount = _context.sent;
                  _context.next = 6;
                  return account.returnAllAccounts();

                case 6:
                  allAccounts = _context.sent;
                  expect(res.body.message).to.be.equal('Account successfully deleted');
                  expect(userAccount).to.be.equal(undefined);
                  expect(allAccounts.size).to.be.equal(2);
                  done();
                  _context.next = 16;
                  break;

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](0);
                  done(_context.t0);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 13]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  });
});