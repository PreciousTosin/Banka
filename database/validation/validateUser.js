/* eslint-disable newline-per-chained-call */
import expressValidator from 'express-validator/check';

const { body } = expressValidator;

class ValidateUser {
  static checkCreateUser() {
    return [
      body('firstname', 'First Name cannot be blank')
        .exists()
        .isAlpha().withMessage('First Name must include only alphabets'),
      body('lastName', 'Last Name cannot be blank').exists()
        .isAlpha().withMessage('Last Name must include only alphabets'),
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').exists()
        .isLength({ min: 8 }).withMessage('Minimum Password length is 8')
        .matches('[0-9]').withMessage('Invalid Password')
        .matches('[a-z]').withMessage('Invalid Password')
        .matches('[A-Z]').withMessage('Invalid Password'),
    ];
  }

  static checkLoginUser() {
    return [
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').exists()
        .matches('[0-9]').withMessage('Invalid Password')
        .matches('[a-z]').withMessage('Invalid Password')
        .matches('[A-Z]').withMessage('Invalid Password'),
    ];
  }
}

export default ValidateUser;
