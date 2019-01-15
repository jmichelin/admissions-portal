require('babel-register')({
   presets: [ 'es2015' ]
});

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

const middlewares = require('./auth/middlewares');
const auth = require('./auth');
const users = require('./api/user');

app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());
app.use(middlewares.checkTokenSetUser);
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/auth', auth);
app.use('/api/v1/user', middlewares.isLoggedIn);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'../client/build/index.html'));
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
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
