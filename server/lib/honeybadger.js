import honeybadger from 'honeybadger';

let dotenv = require('dotenv');
let environment = process.env.NODE_ENV || 'development';
if (environment === 'development' || environment === 'test') {
  dotenv.config();
}

class Honeybadger {
  constructor() {
    this.client = honeybadger.configure({
                                apiKey: process.env.HONEYBADGER_API_KEY,
                                developmentEnvironments: ['development', 'test']
                              });
  }

  notify(err) {
    console.error(err);
    return (this.client) ? this.client.notify(err) : function() {}
  }

  requestHandler() {
    return (this.client) ? this.client.requestHandler : function(req, res, next) { next() }
  }

  errorHandler() {
    return (this.client) ? this.client.errorHandler : function(req, res, next) { next() }
  }
}

export default Honeybadger;
