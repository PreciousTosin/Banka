const bcrypt = require('bcryptjs');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function asyncHashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) reject(error);
        resolve(hash);
      });
    });
  });
}

function asyncComparePassword(password, hash) {
  // returns promise
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
  asyncHashPassword,
  asyncComparePassword,
};
