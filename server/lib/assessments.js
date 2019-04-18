const fetch = require('node-fetch');

class Assessments {

 post(data) {
   fetch(process.env.ASSESSMENTS_SERVICE_DOMAIN + '/assessments', {
     method: 'POST',
     body: JSON.stringify(data),
     headers: {
       Authorization: `Token token="${process.env.ASSESSMENTS_API_KEY}"`,
       'Content-Type': 'application/json'
     },
   }).then(res => {
     console.log(res.headers.raw());
   })
 }
}

export default Assessments;
