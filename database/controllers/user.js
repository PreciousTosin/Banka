import expressValidator from 'express-validator/check';
import user from '../models/user';
import Password from '../../utilities/password';
import tokenUtility from '../../utilities/jwt-token';
import mail from './email';
import resetPasswordReqTemplate, { resetPasswordSuccessTemplate } from '../../utilities/reset-password-temp';


const { asyncComparePassword, asyncHashPassword } = Password;
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

const tokenizeUser = userWithoutToken => new Promise((resolve, reject) => {
  if (userWithoutToken === null) {
    resolve(null);
  }
  return tokenUtility
    .createToken(userWithoutToken)
    .then(token => resolve(token))
    .catch(error => reject(error));
});


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
        .then((userCreated) => {
          const clientPayload = userCreated;
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
      return await tokenUtility.verifyToken(token);
    } catch (e) {
      return e.message;
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

  static forgotUserPassword(req, res) {
    return new Promise((resolve) => {
      const { email } = req.body;
      let userData;
      let token;
      user.findOneByEmail(email).then((foundUser) => {
        if (foundUser.length === 0) throw Object.assign({}, {}, { status: 409, message: 'User does not exist' });
        [userData] = foundUser;
        return userData;
      })
        .then(data => tokenizeUser(data))
        .then((userToken) => {
          const payload = {
            id: userData.id,
            token: userToken,
          };
          ({ token } = payload);
          return user.updateToken(payload);
        })
        .then(() => {
          const payload = {
            name: `${userData.firstname} ${userData.lastname}`,
            url: process.env.NODE_ENV === 'development'
              ? `http://localhost:3000/api/v1/auth/reset-password/${token}`
              : `https://precioustosin.github.io/Banka/api/v1/auth/reset-password/${token}`,
          };
          const html = resetPasswordReqTemplate(payload);
          const mailOptions = {
            from: 'noreply@precioustosin.github.io', // sender address
            to: userData.email, // list of receivers
            subject: 'Password Reset Request', // Subject line
            html, // plain text body
          };
          return mail.sendMail(mailOptions);
        })
        .then((response) => {
          resolve(res.status(200).json(Object.assign({}, { status: 200, message: 'Password reset instructions have been sent to your mail', data: response })));
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

  static resetUserPassword(req, res) {
    return new Promise((resolve) => {
      const { token, password, confirmPassword } = req.body;
      let userData;
      let updatePayload;
      UserController.verifyUser(token) // verify token
        .then((response) => {
          if (response === 'jwt expired') {
            resolve(res.status(400).json(Object.assign({}, { status: 400, error: 'Password reset link has expired' })));
          }
          userData = response;
        })
        .then(() => user.findTokenById(userData.id)) // check if token exists in database
        .then((resp) => {
          if (resp[0].token === 'null' || resp[0].token === null) {
            resolve(res.status(400).json(Object.assign({}, { status: 400, error: 'Password link is Invalid' })));
          }
          return resp;
        })
        .then(() => { // check if passwords match
          if (password !== confirmPassword) {
            resolve(res.status(400).json(Object.assign({}, { status: 400, error: 'Passwords do not match' })));
          }
          return asyncHashPassword(password); // hash new password
        })
        .then((passwordHash) => {
          const payload = {
            password: passwordHash,
          };
          return user.update(userData.id, payload); // update user with new password hash
        })
        .then((response) => {
          [updatePayload] = response;
          const payload = {
            id: updatePayload.id,
            token: null,
          };
          return user.updateToken(payload); // remove token from database
        })
        .then(() => {
          const payload = {
            name: `${userData.firstname} ${userData.lastname}`,
          };
          const html = resetPasswordSuccessTemplate(payload);
          const mailOptions = {
            from: 'noreply@precioustosin.github.io', // sender address
            to: userData.email, // list of receivers
            subject: 'Password Change Successful', // Subject line
            html, // plain text body
          };
          return mail.sendMail(mailOptions); // send password change email
        })
        .then(() => {
          resolve(res.status(200).json(Object.assign({}, { status: 200, message: 'Password Changed Successfully. Login with your new password', data: updatePayload })));
        })
        .catch(error => resolve(res.status(400).json(Object.assign({}, { status: 400, error }))));
    });
  }
}

export default UserController;
