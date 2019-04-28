"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable import/no-extraneous-dependencies */

/* globals describe, it */
process.env.NODE_ENV = 'test';

var chai = require('chai');

var chaiHttp = require('chai-http');

var server = require('../../server'); // const { testDelete } = require('../controllers/user');


chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

function setTokenHeader(token) {
  return "Bearer ".concat(token);
}

describe('/POST User', function () {
  it('it should create new user return status of 200 ok', function (done) {
    var user = {
      id: '',
      firstName: 'Tosin',
      lastName: 'Akinbobola',
      email: 'precioustosin@hotmail.com',
      password: 'precious',
      type: 'client',
      isAdmin: false,
      status: 'inactive'
    };
    chai.request(server).post('/v1/auth/signup').send(user).end(function (err, res) {
      res.should.have.a.status(200);
      done();
    });
  });
});
describe('POST/ User', function () {
  it('it should prevent duplicate users', function (done) {
    var user = {
      id: '',
      firstName: 'Tosin',
      lastName: 'Akinbobola',
      email: 'precioustosin@hotmail.com',
      password: 'precious',
      type: 'client',
      isAdmin: false,
      status: 'inactive'
    };
    chai.request(server).post('/v1/auth/signup').send(user).end(function (err, res) {
      expect(res.body.error).to.be.equal('User exists');
      done();
    });
  });
});
describe('POST/ User', function () {
  var token = '';
  it('it should log user in', function (done) {
    var user = {
      email: 'jamesdonovan@gmail.com',
      password: 'jamesdonovan'
    };
    chai.request(server).post('/v1/auth/signin').send(user).end(function (err, res) {
      token = setTokenHeader(res.body.data.token);
      res.should.have.a.status(200);
      done();
    });
  });
  describe('/GET Users', function () {
    it('It should return status of 200', function (done) {
      chai.request(server).get('/v1/auth/users').set('Authorization', token).end(function (err, res) {
        res.should.have.a.status(200);
        done();
      });
    });
    it('It should get all users', function (done) {
      chai.request(server).get('/v1/auth/users').set('Authorization', token).end(function (err, res) {
        expect(res.body).to.have.lengthOf(5);
        done();
      });
    });
    it('It should be an object(array of object prototype)', function (done) {
      chai.request(server).get('/v1/auth/users').set('Authorization', token).end(function (err, res) {
        res.should.be.a('object');
        done();
      });
    });
  });
  describe('PATCH/ User Account', function () {
    it('it should update user admin status and return status of 200', function (done) {
      chai.request(server).patch("/v1/auth/users/".concat(23568974210520)).set('Authorization', token).send({
        isAdmin: true
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('User updated successfully');
        done();
      });
    });
  });
});
describe('DELETE/ User Account', function () {
  var token = '';
  it('it should log admin in', function (done) {
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
  it('it should delete user account', function (done) {
    chai.request(server)["delete"]("/v1/auth/users/".concat(23568974210520)).set('Authorization', token).end(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(err, res) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                try {
                  expect(res.body.message).to.be.equal('User Deleted successfully');
                  expect(res.body.data.id).to.be.equal(23568974210520);
                  done();
                } catch (e) {
                  done(e);
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  });
});