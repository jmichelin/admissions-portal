const express = require('express');
const Joi = require('joi');
const Q = require('../db/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required()
});

router.get('/', (req, res) => {
  Q.getAllUsers()
    .then(users => {
      res.json(users);
    });
});


router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
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
                res.json(newUser);
                res.status(200);
              });
          })
          .catch(err => next(err));
        }
        // if user already exists throw error
      });
  } else {
    next(result.error);
  }
});

router.post('/signin', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {

  //look for user by Email
  Q.getUserbyEmail(req.body.email)
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password)
        .then(result => {
          if (result) {
            const payload = {
              id: user.id,
              email: user.email
            };

            jwt.sign(payload, process.env.TOKEN_SECRET, {
              expiresIn: '1d'
            }, (err, token) => {
              if (err) {
                respondError(res,next);
              } else {
                res.json({
                  token
                });
              }
            });
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
  const error = new Error('Unable to login.');
  next(error);
}
module.exports = router;
