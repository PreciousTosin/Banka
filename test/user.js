/* globals describe, it, beforeEach */
process.env.NODE_ENV = 'test';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { deleteUser } = require('../controllers/user');

chai.should();
const { expect } = chai;

chai.use(chaiHttp);

describe('/GET Users', () => {
  it('It should return status of 200', (done) => {
    chai.request(server)
      .get('/v1/user')
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });

  it('It should be an object(array of object prototype)', (done) => {
    chai.request(server)
      .get('/v1/user')
      .end((err, res) => {
        res.should.be.a('object');
        done();
      });
  });

  it('It should get all users', (done) => {
    chai.request(server)
      .get('/v1/user')
      .end((err, res) => {
        expect(res.body).to.have.lengthOf(4);
        done();
      });
  });
});

describe('/POST User', () => {
  beforeEach(() => {
    deleteUser('precioustosin@hotmail.com');
  });
  it('it should return status of 200 ok', (done) => {
    const user = {
      id: '',
      firstName: 'Tosin',
      lastName: 'Akinbobola',
      email: 'precioustosin@hotmail.com',
      password: 'precious',
      type: 'client',
      isAdmin: false,
      status: 'inactive',
    };
    chai.request(server)
      .post('/v1/user')
      .send(user)
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });

  it('it should create new user', (done) => {
    const user = {
      id: '',
      firstName: 'Tosin',
      lastName: 'Akinbobola',
      email: 'precioustosin@hotmail.com',
      password: 'precious',
      type: 'client',
      isAdmin: false,
      status: 'inactive',
    };
    chai.request(server)
      .post('/v1/user')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.lengthOf(5);
        done();
      });
  });
});

describe('POST/ Users', () => {
  it('it should prevent duplicate users', (done) => {
    const user = {
      id: '',
      firstName: 'Tosin',
      lastName: 'Akinbobola',
      email: 'precioustosin@hotmail.com',
      password: 'precious',
      type: 'client',
      isAdmin: false,
      status: 'inactive',
    };
    chai.request(server)
      .post('/v1/user')
      .send(user)
      .end((err, res) => {
        expect(res.body.error).to.be.equal('User exists');
        done();
      });
  });
});
