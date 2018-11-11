const express = require('express');
const Joi = require('joi');
const Q = require('../db/queries');
const bcrypt = require('bcryptjs');

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

module.exports = router;
