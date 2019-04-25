import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class TokenUtility {
  static createToken(payload) {
    // eslint-disable-next-line no-param-reassign
    if (payload.password) delete payload.password;
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 10 * 60 }, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  }

  static verifyToken(token) {
    return new Promise((resolve, reject) => jwt
      .verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      }));
  }
}

export default TokenUtility;
