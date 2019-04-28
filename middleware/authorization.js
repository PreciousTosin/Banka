import Token from '../utilities/jwt-token';

const { verifyToken } = Token;

const extractToken = (req) => {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (token === undefined) {
    return false;
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    return token.slice(7, token.length);
  }
  return false;
};

class Authorization {
  static isUser(req, res, next) {
    const token = extractToken(req);

    if (token !== false) {
      verifyToken(token)
        .then((response) => {
          req.authData = {
            id: response.id,
            email: response.email,
            type: response.type,
            isAdmin: response.isAdmin,
          };
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

  static isAdmin(req, res, next) {
    const token = extractToken(req);

    if (token !== false) {
      verifyToken(token)
        .then((response) => {
          if (response.isAdmin === true) {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin,
            };
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

  static isStaff(req, res, next) {
    const token = extractToken(req);

    if (token !== false) {
      verifyToken(token)
        .then((response) => {
          if (response.type === 'staff') {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin,
            };
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

  static isStaffOrAdmin(req, res, next) {
    const token = extractToken(req);

    if (token !== false) {
      verifyToken(token)
        .then((response) => {
          if (response.type === 'staff' || response.type === 'admin') {
            req.authData = {
              id: response.id,
              email: response.email,
              type: response.type,
              isAdmin: response.isAdmin,
            };
            return next();
          }
          return res.status(401).json({
            status: 401,
            error: 'User is neither a staff nor admin',
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
}

export default Authorization;
