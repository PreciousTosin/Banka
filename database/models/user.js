const { asyncHashPassword } = require('../../utilities/password');
const queryDb = require('../query');

const userSchema = {
  id: 'number',
  email: 'string',
  firstName: 'string',
  lastName: 'string',
  password: 'string',
  type: 'string',
  isAdmin: 'boolean',
  status: 'string',
};

function hashPassword(data) {
  return new Promise((resolve, reject) => asyncHashPassword(data.password)
    .then(hash => resolve(hash))
    .catch(error => reject(error)));
}

function makeId() {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
}

const User = {

  create(data) {
    const payload = data;
    return new Promise((resolve, reject) => {
      hashPassword(data)
        .then((hash) => {
          payload.id = makeId();
          payload.password = hash;
          const queryText = `INSERT INTO users(id, email, firstName, lastName, password, type, isAdmin, status)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8);`;
          const params = Object.values(payload);
          return queryDb.query(queryText, params);
        })
        .then((results) => {
          if (results.rowCount === 1) {
            resolve(payload);
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  findOneById(id) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Users WHERE id=${id};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  findOneByEmail(email) {
    return new Promise((resolve) => {
      const queryText = `SELECT * FROM Users WHERE email='${email}';`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          console.log('RETURN ONE USER RECORDS ERROR: ', e);
        });
    });
  },

  findAll() {
    return new Promise((resolve) => {
      const queryText = 'SELECT * FROM Users;';
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          console.log('RETURN ALL USERS RECORDS ERROR: ', e);
        });
    });
  },

  update(id, payload) {
    let userPayload = '';
    const parameter = Object.keys(payload)[0];
    const value = Object.values(payload)[0];
    let queryText = '';
    switch (userSchema[parameter]) {
      case 'string':
        queryText = `UPDATE Users SET ${parameter}='${value}' WHERE id = ${id};`;
        break;
      default:
        queryText = `UPDATE Users SET ${parameter}=${value} WHERE id = ${id};`;
    }
    console.log('UPDATE PARAMS: ', payload);
    return new Promise((resolve, reject) => {
      console.log('UPDATE PARAMS: ', payload, typeof payload);
      console.log('UPDATE KEY: ', parameter, typeof parameter);
      console.log('UPDATE VALUE: ', value, typeof value);
      queryDb.query(queryText)
        .then((res) => {
          console.log('UPDATE RESPONSE: ', res);
          if (res.rowCount === 1) {
            return queryDb.query(`SELECT * FROM Users WHERE id=${id};`);
          }
          return reject(Object.assign({}, { error: 'Update not carried out. Record may not exist' }));
        })
        .then((res) => {
          userPayload = res.rows;
          if (userPayload.length !== 0) delete userPayload[0].password;
          resolve(userPayload);
        })
        .catch((e) => {
          console.log('UPDATE USER RECORD ERROR: ', e);
          reject(e);
        });
    });
  },

  delete(id) {
    let userPayload = '';
    return new Promise((resolve, reject) => {
      const queryText = `DELETE FROM Users WHERE id=${id};`;
      queryDb.query(`SELECT * FROM Users WHERE id=${id};`)
        .then((res) => {
          userPayload = res.rows;
          if (userPayload.length !== 0) delete userPayload[0].password;
          return queryDb.query(queryText);
        })
        .then((res) => {
          if (res.rowCount === 1) {
            resolve(userPayload);
          }
          resolve();
        })
        .catch((e) => {
          console.log('DELETE USER RECORD ERROR: ', e);
          reject(e);
        });
    });
  },
};

module.exports = User;
