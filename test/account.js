/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);
const { expect } = chai;
const account = require('../controllers/account');

function setTokenHeader(token) {
  return `Bearer ${token}`;
}

describe('/POST accounts', () => {
  const newAccount = {
    id: 12586085672261283,
    accountNumber: 2560905761,
    createdOn: new Date(Date.now()),
    owner: 36956655716265,
    type: 'savings',
    status: 'draft',
    balance: 0.00,
  };

  it('it should create account and return status of 200', (done) => {
    chai.request(server)
      .post('/v1/accounts')
      .send(newAccount)
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });
});

describe('/GET AND /PATCH acccounts', () => {
  let token = '';
  it('it should log user in', (done) => {
    const user = {
      email: 'tylerross@gmail.com',
      password: 'tylerross',
    };
    chai.request(server)
      .post('/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        token = setTokenHeader(res.body.data.token);
        res.should.have.a.status(200);
        done();
      });
  });

  describe('/GET accounts', () => {
    it('it should retrieve all accounts and return status of 200', (done) => {
      chai.request(server)
        .get('/v1/accounts')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });
  });

  describe('/PATCH accounts', () => {
    it('it should patch account and return status of 200', (done) => {
      chai.request(server)
        .patch(`/v1/accounts/${2869502843}`)
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
        .delete(`/v1/accounts/${2869502843}`)
        .set('Authorization', token)
        .end(async (err, res) => {
          try {
            const userAccount = await account.getUserAccounts(2869502843);
            const allAccounts = await account.returnAllAccounts();
            expect(res.body.message).to.be.equal('Account successfully deleted');
            expect(userAccount).to.be.equal(undefined);
            expect(allAccounts.size).to.be.equal(2);
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
