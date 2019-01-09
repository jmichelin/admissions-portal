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
- `touch .env` and acquire appropriate keys for `DEV_DB_URL`, `TOKEN_SECRET`, and set `NODE_ENV` to `development`
- `cd src && npm install` installs client packages
- `npm run dev` starts both client and server concurrently


### Adding Styles
This application uses Sass instead of CSS Modules since much of the styling is used from dotcom-node (Galvanize.com) which uses Sass variables.  Instead of importing CSS into each component chose a folder based on what you're styling (Element, Component, Page) within `/src/styles` and create a `.scss` file.  Then import that file into `index.scss` at the base of the client-side code.

### To Deploy
The Heroku Webhook is already integrated into specific branches to automatically deploy.
- To deploy to `STAGING`: Create pull request, have admin approve pull request & merge, and Heroku will automatically deploy to staging.
- To deploy to `PRODUCTION`: Create pull request, have admin approve pull request & merge, and Heroku will automatically deploy to production.
