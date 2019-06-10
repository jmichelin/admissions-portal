const express = require('express');
const Joi = require('joi');
const Q = require('../db/queries');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import crypto from 'crypto';

import Salesforce from '../lib/salesforce';
const salesforce = new Salesforce();

const nodemailer = require('nodemailer');
const router = express.Router();

const signupSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().required(),
  program: Joi.string().required(),
  campus: Joi.string().required(),
  courseType: Joi.string().required(),
  courseProduct: Joi.string().required(),
});

const signinSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(15).required()
});


function createTokenSendResponse(user, opportunities, res, next) {
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
        token,
        data: {
          user: payload,
          applications: opportunities
        },
      });
    }
  });
}

router.post('/signup', async (req, res, next) => {
  const result = Joi.validate(req.body, signupSchema);
  if (result.error !== null) return next(result.error);

  // look for existing user in DB first
  let user = await Q.getUserbyEmail(req.body.email);
  if (user) {
    const error = new Error('A user with this email already exists.');
    res.status(409);
    next(error);
  } else {
      try {
        // look for user in salesforce first and update salseforce
        let salesforceUser = await salesforce.signUpSignInUserUpdate(req.body);
        // Then post new user info with salesforce in fo to DB
        let newBody = req.body;
        newBody.salesforceUser = salesforceUser;
        let hashedPassword = await bcrypt.hash(req.body.password, 12);
        let newUser = await Q.addNewUser(newBody, hashedPassword);
        let values = JSON.stringify({Campus__c: req.body.campus});
        let opportunities = await salesforce.getOpportunities(newUser[0].email);
        if (!opportunities.length) {
          let application = await Q.findOrCreateApplication(req.body.courseType, req.body.courseProduct, newUser[0].id, values);
          opportunities.push(application);
        }
        createTokenSendResponse(newUser[0], opportunities, res, next);
      } catch(err) {
        console.log(err)
        res.status(501);
        const error = new Error('Hmm... There was an error creating your account. Please contact admissions@galvanize.com');
        next(error);
      }
    }
});

router.post('/signin', async (req, res, next) => {
  const result = Joi.validate(req.body, signinSchema);
  if (result.error === null) {
    try {
      let user = await Q.getUserbyEmail(req.body.email);
      if (user) {
        let result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          let salesforceUser = await salesforce.signUpSignInUserUpdate(user);
          createTokenSendResponse(user, [], res, next);
        } else {
          respondError(res, next);
        }
      } else {
        respondError(res, next);
      }
    } catch(err) {
      respondError(res, next);
    }
  } else {
    respondError(res, next);
  }
});

router.post('/forgot-password', (req, res, next) => {
  Q.getUserbyEmail(req.body.email)
  .then((user) => {
    if (!user) {
      const error = new Error('No user with this email exists. Create an account.');
      res.status(422);
      next(error);
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      return Q.updateUserPasswordToken(user, token)
      .then(result => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${process.env.NODEMAILER_EMAIL}`,
              pass: `${process.env.NODEMAILER_PASSWORD}`,
            },
          });

          let LINK_RESET_URL = 'https://admissions.galvanize.com';
          if (process.env.NODE_ENV === 'development') {
            LINK_RESET_URL = 'http://localhost:3000';
          } else if (process.env.NODE_ENV === 'staging') {
            LINK_RESET_URL = process.env.STAGING_URL;
          }

          const mailOptions = {
            from: 'murph.grainger@gmail.com',
            to: `${user.email}`,
            subject: 'Reset Your Admissions Portal Password',
            text:
              'You are receiving this because you (or someone else) have requested the reset of the password for your Admissions Portal account.\n\n'
              + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
              + `${LINK_RESET_URL}/reset${token}\n\n`
              + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
          };

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              respondForgotError(res, next);
            } else {
              res.status(200).json('Recovery Email Sent');
            }
          });

      })
      .catch(err => {
        const error = new Error('Error setting token. Try again.');
        res.status(422);
        next(error);
      })
    }
  }).catch(err => {
    respondError(res, next);
  });
});


router.get('/reset:id', (req, res, next) => {
  Q.getUserbyToken(req.params.id)
    .then((user) => {
    if (!user) {
      const error = new Error('Password reset link is invalid or has expired.');
      res.status(403);
      next(error);
    } else {
      res.status(200).json({
        email: user.email
      });
    }
  }).catch(err => {
    respondForgotError(res, next);
  });
});

router.put('/update-password', (req, res, next) => {
  const result = Joi.validate(req.body, signinSchema);
  if (result.error === null) {
    Q.getUserbyEmail(req.body.email)
      .then(user => {
        if (user) {
          bcrypt.hash(req.body.password, 12)
            .then(hashedPassword => {
              Q.updateUserPassword(user, hashedPassword)
                .then((newUser) => {
                  res.status(200).json('Password reset successful. Proceed to Login.');
                });
            })
            .catch(err => next(err));
        } else {
          const error = new Error('No user with this email exists.');
          res.status(409);
          next(error);
        }
      }).catch(err => {
        respondError(res, next);
      });
  } else {
    next(result.error);
  }
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
