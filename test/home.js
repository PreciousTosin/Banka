/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
// const should = chai.should();

chai.use(chaiHttp);

describe('Landing JSON Msg', () => {
  describe('/GET Home', () => {
    it('It should get the welcome json msg', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.a.status(200);
          res.should.be.an('object');
          done();
        });
    });
  });
});
