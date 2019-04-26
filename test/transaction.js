/* globals describe, it, before, after */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import transaction from '../database/models/transaction';
import account from '../database/models/account';

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

const setTokenHeader = token => `Bearer ${token}`;

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
    account.create(newAccount)
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
        .end((err, res) => {
          transactionIds.push(res.body.data.transactionId);
          res.should.have.a.status(200);
          expect(res.body.data.accountBalance).to.be.equal('1500');
          done();
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

  describe('/GET transaction error', () => {
    it('it should return error 404 status when transaction does not exist', (done) => {
      chai.request(server)
        .get('/v1/transactions/612864')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(404);
          done();
        });
    });
  });

  describe('/GET list of transactions on an account', () => {
    it('it should get a list of transactions on an account and return 200 status', (done) => {
      chai.request(server)
        .get('/v1/accounts/281640892/transactions')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.data.length).to.be.above(0);
          done();
        });
    });
  });

  describe('/GET test for error in getting transaction', () => {
    it('it should return error 400 status if account is not found', (done) => {
      chai.request(server)
        .get('/v1/accounts/28695025/transactions')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(404);
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
        .end((err, res) => {
          transactionIds.push(res.body.data.transactionId);
          res.should.have.a.status(200);
          expect(res.body.data.accountBalance).to.be.equal('900');
          done();
        });
    });
  });

  describe('/DELETE one transaction', () => {
    it('it should delete transaction using its id', (done) => {
      chai.request(server)
        .delete(`/v1/transactions/${transactionIds[0]}`)
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          expect(res.body.message).to.be.equal('Transaction successfully deleted');
          done();
        });
    });
  });

  after((done) => {
    console.log('Action after Tests');
    account.delete(createdAccount.accountNumber)
      .then(() => transactionIds.map(id => transaction.delete(id)))
      .then((transactionRes) => {
        Promise.all(transactionRes)
          .then(() => {
            done();
          });
      })
      .catch(error => error);
  });
});
