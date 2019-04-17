const { Map } = require('immutable');
const user = require('../models/user');
const { asyncComparePassword } = require('./password');
const { createToken, verifyToken } = require('./jwt-token');

/* --------------- UTILITY FUNCTIONS ----------------------- */
function generatePayload(userPayload) {
  return userPayload.delete('password').toObject();
}

const userController = {
  returnAllUsers: () => new Promise((resolve) => {
    user.findAll().then(data => resolve(data));
  }),

  findUserById: id => new Promise((resolve) => {
    user.findOneById(id).then(data => resolve(data));
  }),

  findUserByEmail: email => new Promise((resolve) => {
    user.findOneByEmail(email).then(data => resolve(data));
  }),

  createUser: payload => new Promise((resolve, reject) => {
    const newUser = Map(payload);
    // check first if email exists, if it does, throw an error
    // if user does not exist, create an account
    user.findOneByEmail(payload.email).then((foundUser) => {
      if (foundUser !== undefined) throw Object.assign({}, {}, { status: 409, error: 'User exists' });
      user.create(newUser).then((userCreated) => {
        createToken(generatePayload(userCreated)).then((token) => {
          const tokenizedUser = userCreated.set('token', token); // add token
          const clientPayload = tokenizedUser.delete('password'); // remove password key/value
          resolve(clientPayload);
        }).catch(error => error);
      }).catch(error => error);
    }).catch(error => reject(error));
  }),

  loginUser: async (payload) => {
    try {
      const userData = await user.findOneByEmail(payload.email);
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
    const update = Map(payload);
    const userID = Number(update.get('id'));
    user.findOneById(userID).then((userData) => {
      if (userData === undefined) {
        reject(Object.assign({}, { status: 400, error: 'User not found' }));
      }
      user.update(update).then((patched) => {
        resolve(Object.assign({}, { status: 200, message: 'User updated successfully', data: patched }));
      }).catch(error => error);
    }).catch(error => reject(error));
  }),

  deleteUser: id => new Promise((resolve, reject) => {
    user.delete(id).then((deletedUser) => {
      if (deletedUser !== '') {
        resolve(Object.assign({}, { status: 200, message: 'User Deleted successfully', data: deletedUser }));
      } else {
        reject(Object.assign({}, { status: 400, error: 'User not found' }));
      }
    }).catch(error => reject(error));
  }),
};

module.exports = userController;
