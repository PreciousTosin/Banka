import expressValidator from 'express-validator/check';
import user from '../models/user';
import Password from '../../utilities/password';
import tokenUtility from '../../utilities/jwt-token';


const { asyncComparePassword } = Password;
const { validationResult } = expressValidator;

/* --------------- UTILITY FUNCTIONS ----------------------- */
const generateUserPrint = (userPayload, admin) => ({
  id: userPayload.id ? userPayload.id : userPayload.id,
  email: userPayload.email,
  firstName: userPayload.firstName ? userPayload.firstName : userPayload.firstname,
  lastName: userPayload.lastName ? userPayload.lastName : userPayload.lastname,
  password: userPayload.password,
  type: userPayload.type === 'staff' ? userPayload.type : 'client',
  isAdmin: admin === true ? admin : false,
  status: 'active',
});

const tokenizeUser = userWithoutToken => new Promise((resolve, reject) => tokenUtility
  .createToken(userWithoutToken)
  .then((token) => {
    resolve({
      ...userWithoutToken,
      token,
    });
  })
  .catch(error => reject(error)));

class UserController {
  static returnAllUsers(req, res) {
    return new Promise((resolve, reject) => {
      user.findAll()
        .then(data => data.map(userData => ({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstname,
          lastName: userData.lastname,
          type: userData.type,
          IsAdmin: userData.isadmin,
          status: userData.status,
        })))
        .then(data => resolve(res.status(200).json(Object.assign({}, { status: 200, data }))))
        .catch(() => reject(res.status(404).json((Object.assign({}, { status: 404, error: 'User not found' })))));
    });
  }

  static findUserById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const regex = /@/ig;
      const isEmail = regex.test(id);
      if (isEmail === true) {
        user.findOneByEmail(id)
          .then(data => resolve(res.status(200).json((Object.assign({}, { status: 200, data })))))
          .catch(() => reject(res.status(404).json((Object.assign({}, { status: 404, error: 'User not found' })))));
        return;
      }
      user.findOneById(id)
        .then(data => resolve(res.status(200).json((Object.assign({}, { status: 200, data })))))
        .catch(() => reject(res.status(404).json((Object.assign({}, { status: 404, error: 'User not found' })))));
    });
  }

  static findUserByEmail(email) {
    return new Promise((resolve) => {
      user.findOneByEmail(email).then(data => resolve(data));
    });
  }

  static createUser(req, res) {
    return new Promise((resolve) => {
      const userData = req.body;
      // check for validation errors
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = new Set(errors.array().map(e => e.msg));
      if (!errors.isEmpty()) {
        const errString = [];
        errorList.forEach(err => errString.push(err));
        resolve(res.status(422).json({ status: 422, error: errString.join(', ') }));
        return;
      }
      // check for admin or user url
      const urlLength = req.url.split('/').length;
      const isAdmin = urlLength === 3;
      // check first if email exists, if it does, throw an error
      // if user does not exist, create an account
      const userPayload = generateUserPrint(userData, isAdmin);
      user.findOneByEmail(userPayload.email).then((foundUser) => {
        if (foundUser.length !== 0) throw Object.assign({}, {}, { status: 409, message: 'User exists' });
      })
        .then(() => user.create(userPayload))
        .then(userCreated => tokenizeUser(userCreated))
        .then((tokenedUser) => {
          const clientPayload = tokenedUser;
          delete clientPayload.password; // remove password key/value
          const response = Object.assign({}, {
            status: 200,
            data: clientPayload,
          });
          resolve(res.status(response.status).json(response));
        })
        .catch((error) => {
          let errorMsg = error;
          let resStatus = 400;
          if (error.message) {
            errorMsg = error.message;
            resStatus = error.status;
          }
          const message = { status: resStatus, error: errorMsg };
          resolve(res.status(resStatus).json(Object.assign({}, message)));
        });
    });
  }

  static async loginUser(req, res) {
    try {
      const userPayload = req.body;
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = new Set(errors.array().map(e => e.msg));
      if (!errors.isEmpty()) {
        const errString = [];
        errorList.forEach(err => errString.push(err));
        return res.status(422).json({ status: 422, error: errString.join(', ') });
      }
      // check if user exists
      const userData = await user.findOneByEmail(userPayload.email);
      if (userData === undefined || userData.length === 0) {
        return res.status(404).json(Object.assign({}, { status: 404, error: 'User does not exist' }));
      }

      // check if account is not suspended
      if (userData[0].status === 'inactive') {
        const errorResponse = Object.assign({}, { status: 400, error: 'Your account has been suspended.' });
        return res.status(400).json(errorResponse);
      }

      const isValidUser = await asyncComparePassword(userPayload.password, userData[0].password);
      if (isValidUser === true) {
        // generate user data to tokenize
        const tokenPayload = generateUserPrint(userData[0], userData[0].isadmin);
        userData[0].token = await tokenUtility.createToken(tokenPayload);
        const tokenizedUser = userData[0];
        delete tokenizedUser.password;
        const response = Object.assign({}, { status: 200, data: tokenizedUser });
        return res.status(response.status).json(response);
      }
      return res.status(400).json(Object.assign({}, { status: 400, error: 'Password is incorrect' }));
    } catch (e) {
      if (e.message) {
        return res.status(400).json(Object.assign({}, { status: 400, error: e.message }));
      }
      return res.status(400).json(Object.assign({}, { status: 400, error: e }));
    }
  }

  static async verifyUser(token) {
    try {
      await tokenUtility.verifyToken(token);
      return Object.assign({}, { status: 200, message: 'token is valid' });
    } catch (e) {
      return Object.assign({}, { status: 400, error: e.message });
    }
  }

  static updateUser(req, res) {
    return new Promise((resolve) => {
      if (Object.keys(req.body).length === 0) {
        resolve(res.status(400).json(Object.assign({}, { status: 400, error: 'Invalid Request, You made an empty request' })));
        return;
      }

      if (req.body.password) {
        const errorResponse = Object.assign({}, { status: 400, error: 'Invalid request. You cannot change user password this way' });
        resolve(res.status(400).json(errorResponse));
        return;
      }
      // check for validation errors
      const errors = validationResult(req);
      // remove duplicate messages
      const errorList = new Set(errors.array().map(e => e.msg));
      if (!errors.isEmpty()) {
        const errString = [];
        errorList.forEach(err => errString.push(err));
        resolve(res.status(422).json({ status: 422, error: errString.join(', ') }));
        return;
      }
      const userPayload = {
        id: req.params.id,
        ...req.body,
      };
      const { id } = userPayload;
      const updatePayload = userPayload;
      delete updatePayload.id;
      user.findOneById(id)
        .then((userData) => {
          if (userData === undefined) {
            resolve(res.status(404).json(Object.assign({}, { status: 404, error: 'User not found' })));
          }
        })
        .then(() => user.update(id, updatePayload))
        .then((patched) => {
          resolve(res.status(200).json(Object.assign({}, { status: 200, message: 'User updated successfully', data: patched })));
        })
        .catch(error => resolve(res.status(400).json(Object.assign({}, { status: 404, error }))));
    });
  }

  static deleteUser(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      user.delete(id).then((deletedUser) => {
        if (deletedUser !== undefined) {
          resolve(res.status(200).json(Object.assign({}, { status: 200, message: 'User Deleted successfully', data: deletedUser })));
        } else {
          reject(res.status(404).json(Object.assign({}, { status: 404, error: 'User not found' })));
        }
      }).catch(error => reject(res.status(400).json((Object.assign({}, { status: 400, error })))));
    });
  }
}

export default UserController;
