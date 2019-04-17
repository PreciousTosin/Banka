const { List, Map, fromJS } = require('immutable');
let usersModel = require('../data/user');
const { asyncHashPassword, asyncComparePassword } = require('./password');
const { createToken, verifyToken } = require('./jwt-token');

/* --------------- UTILITY FUNCTIONS ----------------------- */
function makeId() {
  let text = '';
  const possible = '0123456789';
  for (let i = 0; i < 15; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return Number(text);
}

function generatePayload(user) {
  return user.delete('password').toObject();
}

module.exports = {
  returnAllUsers: () => new Promise((resolve) => {
    resolve(usersModel);
  }),

  findUserById: id => new Promise((resolve) => {
    const filteredUser = usersModel.filter(user => user.get('id') === Number(id)).get(0);
    resolve(filteredUser);
  }),

  findUserByEmail: email => new Promise((resolve) => {
    const filteredUser = usersModel.filter(user => user.get('email') === email).get(0);
    resolve(filteredUser);
  }),

  createUser: payload => new Promise((resolve, reject) => {
    const newUser = Map(payload);
    // check first if email exists, if it does, throw an error
    const checkEmailArr = usersModel.filter(user => user.get('email') === newUser.get('email'));
    if (checkEmailArr.size !== 0) throw Object.assign({}, {}, { status: 400, error: 'User exists' });
    asyncHashPassword(newUser.get('password'))
      .then((hash) => {
        const newObj = fromJS({
          id: makeId(),
          password: hash,
        });
        const updatedUser = newUser.merge(newObj); // update id and password
        const newUserArray = List([updatedUser]); // create list from user map
        usersModel = usersModel.concat(newUserArray); // update global user state
        createToken(generatePayload(newObj)).then((token) => {
          const tokenizedUser = updatedUser.set('token', token); // add token
          const clientPayload = tokenizedUser.delete('password'); // remove password key/value
          resolve(clientPayload);
        }).catch(error => reject(error));
      }).catch(error => error);
  }),

  loginUser: async (payload) => {
    try {
      const userData = usersModel.filter(user => user.get('email') === payload.email).get(0);
      if (userData === undefined) {
        return Object.assign({}, { status: 400, error: 'User does not exist' });
      }
      // console.log('USER DATA: ', userData, payload);
      const isValidUser = await asyncComparePassword(payload.password, userData.get('password'));
      if (isValidUser === true) {
        const tokenPayload = generatePayload(userData);
        const token = await createToken(tokenPayload);
        const tokenizedUser = userData.set('token', token);
        const clientPayload = tokenizedUser.delete('password');
        return Object.assign({}, { status: 200, data: clientPayload });
      }
      return Object.assign({}, { status: 400, error: 'Password is incorrect' });
    } catch (e) {
      console.log(e);
      return Object.assign({}, { status: 400, error: e });
    }
  },

  verifyUser: async (token) => {
    try {
      await verifyToken(token);
      return Object.assign({}, { status: 200, message: 'token is valid' });
    } catch (e) {
      return Object.assign({}, { status: 400, error: e.message });
    }
  },

  updateUser: payload => new Promise((resolve, reject) => {
    let userIndex = '';
    const update = Map(payload);
    const userToUpdate = usersModel.filter((user, index) => {
      userIndex = index;
      return user.get('id') === update.get('id');
    }).get(0);
    if (userToUpdate === undefined) {
      reject(Object.assign({}, { status: 400, error: 'User not found' }));
    }
    const updatedUser = userToUpdate.reduce((map, value, key) => {
      // if new data has current key, update the old user data with the new value
      if (update.has(key)) return map.set(key, update.get(key));
      return map;
    }, userToUpdate);
    // update global users state
    usersModel = usersModel.splice(userIndex, 1, updatedUser);
    resolve(Object.assign({}, { status: 200, message: 'User updated successfully', data: updatedUser }));
  }),

  deleteUser: id => new Promise((resolve, reject) => {
    let deletedUser = '';
    usersModel.forEach((user, index) => {
      if (user.get('id') === id) {
        usersModel = usersModel.delete(index);
        deletedUser = user;
      } else if (user.get('email') === id) {
        usersModel = usersModel.delete(index);
        deletedUser = user;
      }
    });
    if (deletedUser !== '') {
      resolve(Object.assign({}, { status: 200, message: 'User Deleted successfully', data: deletedUser }));
    } else {
      reject(Object.assign({}, { status: 400, error: 'User not found' }));
    }
  }),

  testDelete: email => usersModel.forEach((user, index) => {
    if (user.get('email') === email) usersModel = usersModel.delete(index);
  }),
};
