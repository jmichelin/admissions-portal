const express = require('express');
const Joi = require('joi');
const Q = require('../db/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import crypto from 'crypto';


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
    expiresIn: '6h'
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
                  createTokenSendResponse(newUser[0], res, next);
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
      });
  } else {
    respondError(res, next);
  }
});

router.post('/forgot-password', (req, res, next) => {
  Q.getUserbyEmail(req.body.email)
  .then((user) => {
    console.log(user);
    if (!user) {
      const error = new Error('No user with this email exists. Create an account.');
      res.status(422);
      next(error);
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.NODEMAILER_EMAIL}`,
          pass: `${process.env.NODEMAILER_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: 'admissions@galvanize.com',
        to: `${user.email}`,
        subject: 'Link To Reset Password',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
          + `http://localhost:3031/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      console.log('sending mail');

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('there was an error: ', err);
          respondForgotError(res, next);
        } else {
          console.log('here is the res: ', response);
          res.status(200).json('recovery email sent');
        }
      });
    }
  });
});

function respondError(res, next) {
  res.status(422);
  const error = new Error('Unable to login. Check your email and password.');
  next(error);
}

function respondForgotError(res, next) {
  res.status(501);
  const error = new Error('Unable to reset password.');
  next(error);
}
module.exports = router;
