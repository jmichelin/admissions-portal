import auth from './basic-auth';
const jwt = require('jsonwebtoken');
const Q = require('../db/queries');
import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

function checkTokenSetUser(req, res, next) {
  const err = new Error('Your session has expired. Please log back in.');
  const authHeader = req.get('authorization');
  if (authHeader && authHeader.indexOf("Basic") == -1) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (error, authUser) => {
        try {
          if (error || !authUser) {
            res.status(401);
            return next(err);
          }
          let user = await Q.getUserById(authUser.id);
          if(user.salesforce_id == null || user.salesforce_id == "") {
            let searchResponse = await salesforce.findSalesforceUser(user.email);
            let salesforceUser = await searchResponse.searchRecords.find(record => record.attributes.type === 'Contact');
            if (salesforceUser) {
              [user] = await Q.updateSalesforceUserAttrs(user.email, salesforceUser);
            }
          }
          req.user = user;
          next();
        } catch(err) {
          next(err)
        }
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
