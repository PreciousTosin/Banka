/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

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

describe('/GET accounts', () => {
  it('it should retrieve all accounts and return status of 200', (done) => {
    chai.request(server)
      .get('/v1/accounts')
      .end((err, res) => {
        res.should.have.a.status(200);
        expect(res.body).to.have.lengthOf(3);
        done();
      });
  });
});
