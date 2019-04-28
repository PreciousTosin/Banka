/* globals describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('Landing JSON Msg', () => {
  describe('/GET Home', () => {
    it('It should get the welcome json msg', (done) => {
      chai.request(server)
        .get('/api/v1/')
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.a.status(200);
          res.should.be.an('object');
          done();
        });
    });
  });
});

describe('Catch All Route Handler', () => {
  describe('/GET CatchAll', () => {
    it('It should hit the catchall route and return 404 status', (done) => {
      chai.request(server)
        .get('/apiv1/')
        .end((err, res) => {
          if (err) console.log(err);
          res.should.have.a.status(404);
          expect(res.body.error).to.be.equal('Invalid Endpoint');
          done();
        });
    });
  });
});
