/* eslint-disable newline-per-chained-call */
import expressValidator from 'express-validator/check';

const { body } = expressValidator;

class ValidateAccount {
  static checkCreateAccount() {
    return [
      body('type', 'Invalid type. Type must be either savings or current').isIn(['savings', 'current']),
    ];
  }

  static checkUpdateAccount() {
    return [
      body('status', 'Invalid status. Status must either be active or dormant').optional()
        .isIn(['active', 'dormant']),
    ];
  }
}

export default ValidateAccount;
