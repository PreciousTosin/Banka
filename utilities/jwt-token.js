const jwt = require('jsonwebtoken');
require('dotenv').config();

function createToken(payload) {
  // eslint-disable-next-line no-param-reassign
  if (payload.password) delete payload.password;
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 10 * 60 }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => jwt
    .verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    }));
}

module.exports = { createToken, verifyToken };
