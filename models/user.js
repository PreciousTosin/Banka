const { List, fromJS } = require('immutable');
const userData = require('../data/user');
const { asyncHashPassword } = require('../utilities/password');

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

class User {
  static makeId() {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < 15; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Number(text);
  }

  static generatePayload(user) {
    return user.delete('password').toObject();
  }

  static hashPassword(data) {
    return new Promise((resolve, reject) => asyncHashPassword(data.get('password'))
      .then(hash => resolve(hash))
      .catch(error => reject(error)));
  }

  /**
   * class constructor
   * @param {object} defaultUsers
   */
  constructor(schema, defaultUsers) {
    this.schema = schema;
    this.users = defaultUsers;
  }

  /**
   *
   * @returns {object} reflection object
   */
  create(data) {
    return new Promise((resolve, reject) => {
      User.hashPassword(data).then((hash) => {
        const newObj = fromJS({
          id: User.makeId(),
          password: hash,
        });
        const updatedUser = data.merge(newObj); // update id and password
        const newUserArray = List([updatedUser]); // create list from user map
        this.users = this.users.concat(newUserArray); // update global user state
        resolve(updatedUser);
      }).catch(error => reject(error));
    });
  }

  /**
   *
   * @param {uuid} id
   * @returns {object} reflection object
   */
  findOneById(id) {
    return Promise.resolve(this.users.filter(user => user.get('id') === Number(id)).get(0));
  }

  /**
   *
   * @param email
   * @returns {object} reflection object
   */
  findOneByEmail(email) {
    return Promise.resolve(this.users.filter(user => user.get('email') === email).get(0));
  }

  /**
   * @returns {object} returns all reflections
   */
  findAll() {
    return new Promise((resolve) => {
      resolve(this.users);
    });
  }

  /**
   * @param {object} payload
   */
  update(payload) {
    return new Promise((resolve) => {
      const patched = this.users.map((userObj) => {
        if (userObj.get('id') === Number(payload.get('id'))) {
          return userObj.reduce((map, value, key) => {
            if (payload.has(key)) {
              switch (this.schema[key]) {
                case 'number':
                  return map.set(key, Number(payload.get(key)));
                case 'boolean':
                  return map.set(key, payload.get(key) === 'true');
                default:
                  return map.set(key, payload.get(key));
              }
            }
            return map;
          }, userObj);
        }
        return userObj;
      });
      this.users = patched;
      resolve(patched);
    });
  }

  /**
   * @param {string} id
   */
  delete(id) {
    return new Promise((resolve) => {
      let deletedUser = '';
      this.users.forEach((user, index) => {
        if (user.get('id') === Number(id)) {
          this.users = this.users.delete(index);
          deletedUser = user;
        } else if (user.get('email') === id) {
          this.users = this.users.delete(index);
          deletedUser = user;
        }
      });
      resolve(deletedUser);
    });
  }
}

module.exports = new User(userSchema, userData);
