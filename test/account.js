/* globals describe, it */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

const setTokenHeader = token => `Bearer ${token}`;

const newAccount = {
  id: 1258608,
  accountNumber: 256090576,
  createdOn: new Date(Date.now()),
  owner: 36956655,
  type: 'savings',
  status: 'draft',
  balance: 0.00,
};


describe('/GET, POST and /PATCH acccounts', () => {
  let token = '';
  let createdAccount = '';
  it('it should log user in', (done) => {
    const user = {
      email: 'tylerross@gmail.com',
      password: 'tylerross',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        token = setTokenHeader(res.body.data.token);
        res.should.have.a.status(200);
        done();
      });
  });

  describe('/POST accounts', () => {
    it('it should create account and return status of 200', (done) => {
      chai.request(server)
        .post('/api/v1/accounts')
        .set('Authorization', token)
        .send(newAccount)
        .end((err, res) => {
          createdAccount = res.body.data;
          res.should.have.a.status(200);
          done();
        });
    });
  });

  describe('/GET accounts', () => {
    it('it should retrieve all accounts and return status of 200', (done) => {
      chai.request(server)
        .get('/api/v1/accounts')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.above(0);
          done();
        });
    });
  });

  describe('/GET error in finding a specific account', () => {
    it('it should return error status 404 when account does not exist', (done) => {
      chai.request(server)
        .get('/api/v1/accounts/281550892')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(404);
          done();
        });
    });
  });

  describe('/GET a specific account', () => {
    it('it should retrieve a specific account using the accNo and return status of 200', (done) => {
      chai.request(server)
        .get('/api/v1/accounts/281640892')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.above(0);
          done();
        });
    });
  });

  describe('/GET Dormant accounts', () => {
    it('it should retrieve all accounts that have dormant status', (done) => {
      chai.request(server)
        .get('/api/v1/accounts?status=dormant')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.above(0);
          expect(res.body.data[0].status).to.be.equal('dormant');
          done();
        });
    });
  });

  describe('/GET Active accounts', () => {
    it('it should retrieve all accounts that have an active status', (done) => {
      chai.request(server)
        .get('/api/v1/accounts?status=active')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.above(0);
          expect(res.body.data[0].status).to.be.equal('active');
          done();
        });
    });
  });

  describe('/PATCH accounts', () => {
    it('it should patch account and return status of 200', (done) => {
      chai.request(server)
        .patch(`/api/v1/accounts/${createdAccount.accountNumber}`)
        .set('Authorization', token)
        .send({ status: 'active' })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data.status).to.be.equal('active');
          done();
        });
    });
  });

  describe('/DELETE accounts', () => {
    it('it should delete account', (done) => {
      chai.request(server)
        .delete(`/api/v1/accounts/${createdAccount.accountNumber}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.body.message).to.be.equal('Account successfully deleted');
          done();
        });
    });
  });
});
