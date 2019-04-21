/* eslint-disable import/no-extraneous-dependencies */
/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.should();

chai.use(chaiHttp);

describe('Landing JSON Msg', () => {
  describe('/GET Home', () => {
    it('It should get the welcome json msg', (done) => {
      chai.request(server)
        .get('/v1/')
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.a.status(200);
          res.should.be.an('object');
          done();
        });
    });
  });
});
