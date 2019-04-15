# Galvanize Admissions Portal

Application to allow prospective students to apply for Galvanize programs.

### Technologies
- React
- Express
- Node
- Sass


### To Start
This app uses a proxy server to run locally so your console will show both server and client outputs at once.

- `npm install` installs server packages
- `createdb admissions_dev` to create the database, get its connection string, most likely `postgres://localhost/admissions_dev` however you may have username password requirements
- `cp server/.env-example server/.env` and set `DEV_DB_URL` to the db connection string, set `TOKEN_SECRET` for jwt signing, and set `NODE_ENV` to `development`. Get remaining env vars from a co-worker
- `cd server && knex migrate:latest --env=development`; if you don't have `knex` installed, run `npm i -g knex`
- `cd ../client && npm install` installs client packages within the client directory
- `npm run dev` starts both client and server concurrently


### Adding Styles
This application uses Sass instead of CSS Modules since much of the styling is used from dotcom-node (Galvanize.com) which uses Sass variables.  Instead of importing CSS into each component chose a folder based on what you're styling (Element, Component, Page) within `/src/styles` and create a `.scss` file.  Then import that file into `index.scss` at the base of the client-side code.

### To Deploy
The Heroku Webhook is already integrated into specific branches to automatically deploy.
- To deploy to `STAGING`: Create pull request, have admin approve pull request & merge, and Heroku will automatically deploy to staging.
- To deploy to `PRODUCTION`: Create pull request, have admin approve pull request & merge, and Heroku will automatically deploy to production.
