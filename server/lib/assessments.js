const fetch = require('node-fetch');

class Assessments {

 static post(data) {
   return fetch(`${process.env.ASSESSMENTS_SERVICE_DOMAIN}/assessments`, {
     method: 'POST',
     body: JSON.stringify(data),
     headers: {
       Authorization: `Token token="${process.env.ASSESSMENTS_API_KEY}"`,
       'Content-Type': 'application/json'
     },
   })
 }
}

module.exports = Assessments;
