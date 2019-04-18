const { verifyToken } = require('../utilities/jwt-token');

function extractToken(req) {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (token === undefined) {
    return false;
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return token.slice(7, token.length);
  }
  return false;
}

function isUser(req, res, next) {
  const token = extractToken(req);

  if (token !== false) {
    verifyToken(token)
      .then((response) => {
        req.decoded = response;
        next();
      })
      .catch(error => res.status(401).json({
        status: 401,
        error: error.message,
      }));
  } else {
    return res.status(401).json({
      status: 401,
      message: 'Auth token is not supplied',
    });
  }
  return 'token error';
}

function isAdmin(req, res, next) {
  const token = extractToken(req);

  if (token !== false) {
    verifyToken(token)
      .then((response) => {
        if (response.isAdmin === true) {
          return next();
        }
        return res.status(401).json({
          status: 401,
          error: 'User is not an admin',
        });
      })
      .catch(error => res.status(401).json({
        status: 401,
        error: error.message,
      }));
  } else {
    return res.status(401).json({
      status: 401,
      error: 'Auth token is not supplied',
    });
  }
  return 'token error';
}

function isStaff(req, res, next) {
  const token = extractToken(req);

  if (token !== false) {
    verifyToken(token)
      .then((response) => {
        if (response.type === 'staff') {
          return next();
        }
        return res.status(401).json({
          status: 401,
          error: 'User is not a staff',
        });
      })
      .catch(error => res.status(401).json({
        status: 401,
        error: error.message,
      }));
  } else {
    return res.status(401).json({
      status: 401,
      error: 'Auth token is not supplied',
    });
  }
  return 'token error';
}

module.exports = { isUser, isAdmin, isStaff };
