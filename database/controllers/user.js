const user = require('../models/user');
const { asyncComparePassword } = require('../../utilities/password');
const { createToken, verifyToken } = require('../../utilities/jwt-token');

/* --------------- UTILITY FUNCTIONS ----------------------- */
function generateUserPrint(userPayload) {
  return {
    id: userPayload.id ? userPayload.id : userPayload.id,
    email: userPayload.email,
    firstName: userPayload.firstName ? userPayload.firstName : userPayload.firstname,
    lastName: userPayload.lastName ? userPayload.lastName : userPayload.lastname,
    password: userPayload.password,
    type: userPayload.type,
    isAdmin: userPayload.isAdmin ? userPayload.isAdmin : userPayload.isadmin,
    status: userPayload.status,
  };
}

function tokenizeUser(userWithoutToken) {
  return new Promise((resolve, reject) => createToken(userWithoutToken)
    .then((token) => {
      resolve({
        ...userWithoutToken,
        token,
      });
    })
    .catch(error => reject(error)));
}

const userController = {
  returnAllUsers: () => new Promise((resolve) => {
    user.findAll().then(data => resolve(Object.assign({}, { status: 200, data })));
  }),

  findUserById: id => new Promise((resolve) => {
    const regex = /@/ig;
    const isEmail = regex.test(id);
    if (isEmail === true) {
      user.findOneByEmail(id).then(data => resolve((Object.assign({}, { status: 200, data }))));
    }
    user.findOneById(id).then(data => resolve((Object.assign({}, { status: 200, data }))));
  }),

  findUserByEmail: email => new Promise((resolve) => {
    user.findOneByEmail(email).then(data => resolve(data));
  }),

  createUser: payload => new Promise((resolve, reject) => {
    // check first if email exists, if it does, throw an error
    // if user does not exist, create an account
    const userPayload = generateUserPrint(payload);
    user.findOneByEmail(userPayload.email).then((foundUser) => {
      if (foundUser.length !== 0) throw Object.assign({}, {}, { status: 409, error: 'User exists' });
    })
      .then(() => user.create(userPayload))
      .then(userCreated => tokenizeUser(userCreated))
      .then((tokenedUser) => {
        const clientPayload = tokenedUser;
        delete clientPayload.password; // remove password key/value
        resolve(clientPayload);
      })
      .catch((error) => {
        if (typeof error === 'object') reject(error);
        reject(Object.assign({}, {}, { status: 400, error }));
      });
  }),

  loginUser: async (payload) => {
    try {
      const userData = await user.findOneByEmail(payload.email);
      if (userData === undefined) {
        return Object.assign({}, { status: 400, error: 'User does not exist' });
      }
      // console.log('USER DATA: ', userData, payload);
      const isValidUser = await asyncComparePassword(payload.password, userData[0].password);
      if (isValidUser === true) {
        const tokenPayload = generateUserPrint(userData[0]);
        userData[0].token = await createToken(tokenPayload);
        const tokenizedUser = userData[0];
        delete tokenizedUser.password;
        return Object.assign({}, { status: 200, data: tokenizedUser });
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
    const { id } = payload;
    const updatePayload = payload;
    delete updatePayload.id;
    user.findOneById(id)
      .then((userData) => {
        if (userData === undefined) {
          reject(Object.assign({}, { status: 404, error: 'User not found' }));
        }
      })
      .then(() => user.update(id, updatePayload))
      .then((patched) => {
        resolve(Object.assign({}, { status: 200, message: 'User updated successfully', data: patched }));
      })
      .catch(error => reject(Object.assign({}, { status: 404, error })));
  }),

  deleteUser: id => new Promise((resolve, reject) => {
    user.delete(id).then((deletedUser) => {
      if (deletedUser !== undefined) {
        resolve(Object.assign({}, { status: 200, message: 'User Deleted successfully', data: deletedUser }));
      } else {
        reject(Object.assign({}, { status: 404, error: 'User not found' }));
      }
    }).catch(error => reject((Object.assign({}, { status: 400, error }))));
  }),
};

module.exports = userController;
