/* globals describe, it, before, after */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const transaction = require('../database/controllers/transaction');
const account = require('../database/controllers/account');

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

function setTokenHeader(token) {
  return `Bearer ${token}`;
}

const newAccount = {
  id: '',
  accountNumber: '',
  createdOn: '',
  owner: 36956655,
  type: 'savings',
  status: 'draft',
  balance: 0.00,
};

describe('/POST and /GET transactions', () => {
  let token = '';
  let createdAccount = '';
  const transactionIds = [];

  before((done) => {
    console.log('Action before Tests');
    account.createBankAccount(newAccount)
      .then((response) => {
        createdAccount = response;
        done();
      })
      .catch(error => error);
  });

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
        cashier: 36956,
        amount: 1500,
      };
      chai.request(server)
        .post(`/v1/transactions/${createdAccount.accountNumber}/credit`)
        .set('Authorization', token)
        .send(payload)
        .end(async (err, res) => {
          try {
            transactionIds.push(res.body.data.transactionId);
            res.should.have.a.status(200);
            expect(res.body.data.accountBalance).to.be.equal('1500');
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
          expect(res.body.data.length).to.be.above(0);
          done();
        });
    });
  });

  describe('/GET transactions', () => {
    it('it should get a specific transaction with an id return and 200 status', (done) => {
      chai.request(server)
        .get('/v1/transactions/612879')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data[0].transactionId).to.be.equal(612879);
          done();
        });
    });
  });

  describe('/POST debit transactions', () => {
    it('it should create a new debit transaction', (done) => {
      const payload = {
        type: 'debit',
        cashier: 36956,
        amount: 600,
      };
      chai.request(server)
        .post(`/v1/transactions/${createdAccount.accountNumber}/debit`)
        .set('Authorization', token)
        .send(payload)
        .end(async (err, res) => {
          try {
            transactionIds.push(res.body.data.transactionId);
            res.should.have.a.status(200);
            expect(res.body.data.accountBalance).to.be.equal('900');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  after((done) => {
    console.log('Action after Tests', transactionIds);
    account.deleteBankAccount(createdAccount.accountNumber)
      .then(() => transactionIds.map(id => transaction.deleteTransaction(id)))
      .then((transactionRes) => {
        Promise.all(transactionRes)
          .then(() => {
            done();
          });
      })
      .catch(error => error);
  });
});
