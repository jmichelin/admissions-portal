import auth from './basic-auth';
const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
  const err = new Error('Your session has expired. Please log back in.');
  const authHeader = req.get('authorization');
  if (authHeader && authHeader.indexOf("Basic") == -1) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          res.status(401);
          next(err);
        }
        req.user = user;
        next();
      });
    } else {
      next(err);
    }
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401);
    const error = new Error('Your session has expired. Please log back in.');
    next(error);
  }
}

function verifyBasicAuth(req, res, next) {
  let credentials;
  try {
    credentials = auth.basic.parseHeader(req);
  } catch(err) {
    return _unauthorized(res, err.toString());
  }
  
  if (!credentials) return _unauthorized(res, 'Invalid Credentials');
  
  if (auth.basic.isAuthorized(credentials.username, credentials.password)) {
    return next();
  }
  
  return _unauthorized(res);
}

function _unauthorized(res, msg) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.status(401).send(msg);
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  verifyBasicAuth
};
