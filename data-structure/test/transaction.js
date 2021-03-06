/* eslint-disable import/no-extraneous-dependencies */
/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const transaction = require('../controllers/transaction');

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

function setTokenHeader(token) {
  return `Bearer ${token}`;
}

describe('/POST and /GET transactions', () => {
  let token = '';
  it('it should log user in', (done) => {
    const user = {
      email: 'johnwayne@gmail.com',
      password: 'johnwayne',
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

  describe('/POST credit transactions', () => {
    it('it should create a new credit transaction', (done) => {
      const payload = {
        type: 'credit',
        cashier: 36956655716265,
        amount: 150,
      };
      chai.request(server)
        .post(`/v1/transactions/${2816408925}/credit`)
        .set('Authorization', token)
        .send(payload)
        .end(async (err, res) => {
          try {
            const allTransactions = await transaction.returnAllTransations();
            res.should.have.a.status(200);
            expect(allTransactions.size).to.be.equal(2);
            expect(res.body.data.accountBalance).to.be.equal('650');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('/GET transactions', () => {
    it('it should return all transactions and 200 status', (done) => {
      chai.request(server)
        .get('/v1/transactions')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.equal(2);
          done();
        });
    });
  });

  describe('/GET transactions', () => {
    it('it should get a specific transaction with an id return and 200 status', (done) => {
      chai.request(server)
        .get('/v1/transactions/61287962375006273000')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.id).to.be.equal(61287962375006273000);
          done();
        });
    });
  });

  describe('/POST debit transactions', () => {
    it('it should create a new debit transaction', (done) => {
      const payload = {
        type: 'debit',
        cashier: 36956655716265,
        amount: 200,
      };
      chai.request(server)
        .post(`/v1/transactions/${2816408925}/debit`)
        .set('Authorization', token)
        .send(payload)
        .end(async (err, res) => {
          try {
            const allTransactions = await transaction.returnAllTransations();
            res.should.have.a.status(200);
            expect(allTransactions.size).to.be.equal(3);
            expect(res.body.data.accountBalance).to.be.equal('450');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });
});
