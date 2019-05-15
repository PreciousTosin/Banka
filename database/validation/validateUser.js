/* eslint-disable newline-per-chained-call */
import expressValidator from 'express-validator/check';

const { body, check } = expressValidator;

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

  static checkForgotPassword() {
    return [
      body('email', 'Email cannot be blank').exists().isEmail().withMessage('Invalid email'),
    ];
  }

  static checkResetPassword() {
    return [
      check('token', 'Token is required').exists(),
      body('password', 'Password is required')
        .exists()
        .isLength({
          min: 6,
        })
        .withMessage('Password must contain at least 6 characters')
        .isLength({
          max: 20,
        })
        .withMessage('Password can contain max 20 characters'),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    ];
  }
}

export default ValidateUser;
