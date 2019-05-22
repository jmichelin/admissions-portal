const express = require('express');
var secure = require('express-force-https');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('babel-register')({
     presets: [ 'es2015' ]
  });
}

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(secure);
}

const middlewares = require('./auth/middlewares');
const auth = require('./auth');
const users = require('./api/user');
const assessments = require('./api/assessments');
const courses = require('./api/courses');
const testingWebhook = require('./webhooks/assessments/assessments');
const salesforceWebhook = require('./webhooks/salesforce/salesforce.webhooks.controller');

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.BASE_URL,
}));

app.use(middlewares.checkTokenSetUser);
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/auth', express.json(), auth);
app.use('/api/v1/user', express.json(), middlewares.isLoggedIn, users);
app.use('/api/v1/courses', express.json(), middlewares.isLoggedIn, courses);
app.use('/api/v1/assessments', express.json(), middlewares.isLoggedIn, assessments);
app.use('/webhooks/assessments', express.urlencoded({extended: true}), testingWebhook);
app.use('/webhooks/salesforce/courses', express.json(), middlewares.verifyBasicAuth, salesforceWebhook);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500).json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
