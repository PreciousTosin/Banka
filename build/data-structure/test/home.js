"use strict";

/* eslint-disable import/no-extraneous-dependencies */

/* globals describe, it */
process.env.NODE_ENV = 'test';

var chai = require('chai');

var chaiHttp = require('chai-http');

var server = require('../../server');

chai.should();
chai.use(chaiHttp);
describe('Landing JSON Msg', function () {
  describe('/GET Home', function () {
    it('It should get the welcome json msg', function (done) {
      chai.request(server).get('/v1/').end(function (err, res) {
        if (err) console.log(err);
        res.should.have.a.status(200);
        res.should.be.an('object');
        done();
      });
    });
  });
});