const express = require('express');
const Joi = require('joi');
const Q = require('../db/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const signupSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required()
});

const signinSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required()
});


function createTokenSendResponse(user, res, next) {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name:user.last_name
  };
  jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  }, (err, token) => {
    if (err) {
      respondError(res, next);
    } else {
      res.json({
        token
      });
    }
  });
}


router.get('/', (req, res) => {
  res.json({
    user: req.user,
    message: 'Hello!'
  });
});




router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, signupSchema);
  if (result.error === null) {
    Q.getUserbyEmail(req.body.email)
      .then(user => {
        if (user) {
          const error = new Error('A user with this email already exists.');
          res.status(409);
          next(error);
        } else {
          bcrypt.hash(req.body.password, 12)
            .then(hashedPassword => {
              Q.addNewUser(req.body, hashedPassword)
                .then((newUser) => {
                  // res.status(200);
                  createTokenSendResponse(newUser, res, next);
                });
            })
            .catch(err => next(err));
        }
      });
  } else {
    next(result.error);
  }
});

router.post('/signin', (req, res, next) => {
  const result = Joi.validate(req.body, signinSchema);
  if (result.error === null) {

    //look for user by Email
    Q.getUserbyEmail(req.body.email)
      .then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password)
            .then(result => {
              if (result) {
                createTokenSendResponse(user, res, next);
              } else {
                respondError(res, next);
              }
            });
        } else {
          respondError(res, next);
        }
        // if user already exists throw error
      });
  } else {
    respondError(res, next);
  }
  //if no email throw error, if email

});

function respondError(res, next) {
  res.status(422);
  const error = new Error('Unable to login. Check your email and password.');
  next(error);
}
module.exports = router;
