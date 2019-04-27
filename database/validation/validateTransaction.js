/* eslint-disable newline-per-chained-call */
import expressValidator from 'express-validator/check';

const { body } = expressValidator;

class ValidateTransaction {
  static checkCreateTransaction() {
    return [
      body('amount', 'Invalid amount. Amount cannot be blank').exists()
        .isInt().withMessage('Invalid amount. Amount must be a number'),
    ];
  }
}

export default ValidateTransaction;
