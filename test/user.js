/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
// const { testDelete } = require('../controllers/user');

chai.should();
const { expect } = chai;

chai.use(chaiHttp);

function setTokenHeader(token) {
  return `Bearer ${token}`;
}

describe('/POST User', () => {
  it('it should create new user return status of 200 ok', (done) => {
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
      .post('/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.a.status(200);
        done();
      });
  });
});

describe('POST/ User', () => {
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
      .post('/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.error).to.be.equal('User exists');
        done();
      });
  });
});

describe('POST/ User', () => {
  let token = '';
  it('it should log user in', (done) => {
    const user = {
      email: 'jamesdonovan@gmail.com',
      password: 'jamesdonovan',
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

  describe('/GET Users', () => {
    it('It should return status of 200', (done) => {
      chai.request(server)
        .get('/v1/auth/users')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.a.status(200);
          done();
        });
    });

    it('It should get all users', (done) => {
      chai.request(server)
        .get('/v1/auth/users')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });

    it('It should be an object(array of object prototype)', (done) => {
      chai.request(server)
        .get('/v1/auth/users')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.be.a('object');
          done();
        });
    });
  });
});
