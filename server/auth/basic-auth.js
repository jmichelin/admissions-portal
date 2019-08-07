'use strict';
var Buffer = require('buffer').Buffer;

export default {
  isBase64: isBase64,
  decodeBase64: decodeBase64,
  encodeBase64: encodeBase64,
  basic: {
    parseHeader: parseHeaderBasic,
    isAuthorized: isAuthorizedBasic
  }
}

function parseHeaderBasic(req) {
  let authHeader = req.headers && req.headers.authorization;
  if (!authHeader) throw new Error('Authentication header is not present.');

  let auth = authHeader.split(' ');
  if (!auth[1]) throw new Error('No username / password found in auth password.');
  if (auth[0] !== 'Basic') throw new Error('Basic auth header format is invalid.');
  if (!isBase64(auth[1])) throw new Error('Auth Header is not Base64 encoded.');

  let decodedAuth = decodeBase64(auth[1]);

  let userPw = decodedAuth.split(':');
  let isValidHeader = userPw &&
                      userPw[0] &&
                      userPw[1];

  if (!isValidHeader) throw new Error('Basic auth header is invalid.');

  return {
    username: userPw[0],
    password: userPw[1]
  }
}

function isAuthorizedBasic(username, password) {
  return !!(username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD);
}

function decodeBase64(b64Encoded) {
  return Buffer.from(b64Encoded, 'base64').toString();
}

function encodeBase64(str) {
   return new Buffer(str).toString('base64');
}

function isBase64(str) {
  try {
    return !!(encodeBase64(decodeBase64(str)) === str);
  } catch (err) {
    return false;
  }
}
