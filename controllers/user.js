const { List, Map, fromJS } = require('immutable');
let usersModel = require('../models/user');
const { asyncHashPassword } = require('./password');

/* --------------- UTILITY FUNCTIONS ----------------------- */
function makeId() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 15; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return `banka-${text}`;
}

module.exports = {
  returnAllUsers: () => new Promise((resolve) => {
    resolve(usersModel);
  }),

  findUserById: id => new Promise((resolve) => {
    const filteredUser = usersModel.filter(user => user.get('id') === id).get(0);
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
        resolve(usersModel);
      }).catch(error => reject(error));
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
};
