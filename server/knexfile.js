require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DEV_DB_URL
  },

  test: {
    client: 'pg',
    connection: process.env.TEST_DB_URL,
    pool: { min: 1, max: 1 }
  },

  staging: {
    client: 'pg',
    connection: process.env.STAGING_DB_URL + '?ssl=true'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }
};
