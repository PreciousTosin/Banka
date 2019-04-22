/* eslint-disable import/no-extraneous-dependencies */
/* globals describe, it */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
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

  describe('PATCH/ User Account', () => {
    it('it should update user admin status and return status of 200', (done) => {
      chai.request(server)
        .patch(`/v1/auth/users/${23568974210520}`)
        .set('Authorization', token)
        .send({ isAdmin: true })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.message).to.be.equal('User updated successfully');
          done();
        });
    });
  });
});

describe('DELETE/ User Account', () => {
  let token = '';
  it('it should log admin in', (done) => {
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

  it('it should delete user account', (done) => {
    chai.request(server)
      .delete(`/v1/auth/users/${23568974210520}`)
      .set('Authorization', token)
      .end(async (err, res) => {
        try {
          expect(res.body.message).to.be.equal('User Deleted successfully');
          expect(res.body.data.id).to.be.equal(23568974210520);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});
