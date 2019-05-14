import Password from '../../utilities/password';
import queryDb from '../query';
import tokenUtility from '../../utilities/jwt-token';

const { asyncHashPassword } = Password;

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

const hashPassword = data => new Promise((resolve, reject) => asyncHashPassword(data.password)
  .then(hash => resolve(hash))
  .catch(error => reject(error)));

const makeId = () => {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 8; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
};

const tokenizeUser = userWithoutToken => new Promise((resolve, reject) => {
  if (userWithoutToken === null) {
    resolve(null);
  }
  return tokenUtility
    .createToken(userWithoutToken)
    .then(token => resolve(token))
    .catch(error => reject(error));
});


class User {
  static create(data) {
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
        .then((userResults) => {
          if (userResults.rowCount === 1) {
            return tokenizeUser(payload);
          }
          return new Error('User not created');
        })
        .then((token) => {
          payload.token = token;
          const queryText = 'INSERT INTO tokens(owner, token) VALUES($1, $2);';
          const params = [payload.id, token];
          return queryDb.query(queryText, params);
        })
        .then((results) => {
          if (results.rowCount === 1) {
            resolve(payload);
          }
          resolve();
        })
        .catch((error) => {
          if (error.message) reject(error.message);
          reject(error);
        });
    });
  }

  static findOneById(id) {
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
  }

  static findOneByEmail(email) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Users WHERE email='${email}';`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      const queryText = 'SELECT * FROM Users;';
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  static update(id, payload) {
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
    return new Promise((resolve, reject) => {
      queryDb.query(queryText)
        .then((res) => {
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
          reject(e);
        });
    });
  }

  static delete(id) {
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
          reject(e);
        });
    });
  }

  static findTokenById(id) {
    return new Promise((resolve, reject) => {
      const queryText = `SELECT * FROM Tokens WHERE owner=${id};`;
      queryDb.query(queryText)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateToken(payload) {
    return new Promise((resolve, reject) => {
      const queryText = `UPDATE Tokens SET token='${payload.token}' WHERE owner = ${payload.id};`;
      queryDb.query(queryText)
        .then((res) => {
          if (res.rowCount === 1) {
            resolve(res);
          } else throw new Error('Token Update Failed');
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default User;
