/* eslint-disable newline-per-chained-call */
import expressValidator from 'express-validator/check';

const { body } = expressValidator;

class ValidateUser {
  static checkCreateUser() {
    return [
      body('firstName', 'First Name cannot be blank')
        .exists()
        .isAlpha().withMessage('First Name must include only alphabets'),
      body('lastName', 'Last Name cannot be blank').exists()
        .isAlpha().withMessage('Last Name must include only alphabets'),
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').exists()
        .isLength({ min: 8 }).withMessage('Minimum Password length is 8')
        .matches('[0-9a-zA-Z]').withMessage('Invalid Password'),
    ];
  }

  static checkCreateAdmin() {
    return [
      body('firstName', 'First Name cannot be blank')
        .exists()
        .isAlpha().withMessage('First Name must include only alphabets'),
      body('lastName', 'Last Name cannot be blank').exists()
        .isAlpha().withMessage('Last Name must include only alphabets'),
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').exists()
        .isLength({ min: 8 }).withMessage('Minimum Password length is 8')
        .matches('[0-9a-zA-Z]').withMessage('Invalid Password'),
      body('type', 'User type cannot be blank').exists()
        .isIn(['client', 'staff']).withMessage('Invalid type. User type must either be client or staff'),
      body('isAdmin', 'isAdmin cannot be blank').exists()
        .isBoolean().withMessage('Invalid value. isAdmin must either be true or false'),
    ];
  }

  static checkLoginUser() {
    return [
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').exists()
        .matches('[0-9a-zA-Z]').withMessage('Invalid Password'),
    ];
  }

  static checkUpdateUser() {
    return [
      body('firstName', 'First Name must include only alphabets')
        .optional()
        .isAlpha().withMessage('First Name must include only alphabets'),
      body('lastName', 'Last Name cannot be blank').optional()
        .isAlpha().withMessage('Last Name must include only alphabets'),
      body('email', 'Email cannot be blank').optional().isEmail().withMessage('Invalid email'),
      body('password', 'Password cannot be blank').optional()
        .isLength({ min: 8 }).withMessage('Minimum Password length is 8')
        .matches('[0-9a-zA-Z]').withMessage('Invalid Password'),
      body('type', 'Invalid type. User type must either be client or staff').optional()
        .isIn(['client', 'staff']),
      body('isAdmin', 'Invalid value. isAdmin must either be true or false').optional()
        .isBoolean(),
    ];
  }
}

export default ValidateUser;
