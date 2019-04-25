/* globals describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

process.env.NODE_ENV = 'test';

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
