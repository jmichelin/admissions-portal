const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
  const err = new Error('Your session has expired. Please log back in.');
  const authHeader = req.get('authorization');
  if (authHeader) {
    console.log('authheader', req.url);
    const token = authHeader.split(' ')[1];
    if (token) {
      console.log('token', req.url);
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
    console.log('noauthheader', req.url);
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('here yikes!!!!!');
    res.status(401);
    const error = new Error('Your session has expired. Please log back in.');
    next(error);
  }
}

module.exports = {
  checkTokenSetUser,
  isLoggedIn
};
