'use strict';

import jsforce from 'jsforce';
import _ from 'lodash';

import moment from 'moment';


import {
  LEAD_PROSPECT_RECORD_ID,
  LEAD_STUDENT_RECORD_ID,
  SF_WDI_SYLLABUS_CAMPAIGN_ID,
  SF_WDI_APPLICATION_CAMPAIGN_ID,
  SF_DSI_SYLLABUS_CAMPAIGN_ID,
  SF_DSI_APPLICATION_CAMPAIGN_ID,
  SF_NEWSLETTER_CAMPAIGN_ID,
  CAMPUSES,
  IMMERSIVE_COURSE_TYPES
} from '../constants';

var dotenv = require('dotenv');
var environment = process.env.NODE_ENV || 'development';
if (environment === 'development' || environment === 'test') {
  dotenv.config();
}

class Salesforce {

  constructor() {
    this.username = process.env.SF_USERNAME;
    this.password = process.env.SF_PASSWORD;
    this.baseUrl = process.env.SF_OAUTH_BASE_URL;
    this.connection = new jsforce.Connection({
      loginUrl : this.baseUrl
    });
  }

  login() {
    return new Promise( (resolve, reject) => {
      this.connection.login(this.username, this.password, (err, userInfo) => {
        if (err) { reject(err); }
        resolve(userInfo);
      });
    });
  }

  async findSalesforceUser(email) {
    await this.login();
    let queryString = _makeSalesforceUserQuery(email);
    return new Promise( (resolve, reject) => {
      this.connection.search(
        queryString,
        (err, res) => {
          if (err) { reject(err); }
        resolve(res);
      });
    });
  }

  async signUpSignInUserUpdate(requestbody){
    let salesforceUser = null;
    let searchResponse = await this.findSalesforceUser(requestbody.email);

    // if contact - update contact to reflect portal account creation
    salesforceUser = await searchResponse.searchRecords.find(record => record.attributes.type === 'Contact');
    if (salesforceUser) {
      let contact = {
        Id: salesforceUser.Id,
        FirstName: requestbody.first_name,
        LastName: requestbody.last_name,
        Campus__c: requestbody.campus,
        Product__c: requestbody.courseProduct,
        Has_Portal_Account__c: true,
        Last_Portal_Login__c: new Date()
      };

      await this.updateContact(contact);
    }

    // if no contact look for lead and update lead
    if (!salesforceUser) {
      salesforceUser = await searchResponse.searchRecords.find(record => record.attributes.type === 'Lead');
      if (salesforceUser){
        let lead = {
          RecordTypeId: LEAD_STUDENT_RECORD_ID,
          Id: salesforceUser.Id,
          FirstName: requestbody.first_name,
          LastName: requestbody.last_name,
          Campus__c: requestbody.campus,
          Product__c: requestbody.courseProduct,
          Has_Portal_Account__c: true,
          Last_Portal_Login__c: new Date()
        }
        await this.updateLead(lead);
      }
    }

    //if no contact or lead create a lead
    if (!salesforceUser) {
      console.log("new lead")
      let newLead = await this.createLead(requestbody);
      salesforceUser = { Id: newLead.Id, attributes: {type: 'Lead'}};
    }

    return salesforceUser;
  }

  async createLead(formData) {
    return new Promise( (resolve, reject) => {
      let newForm = {};
      newForm.FirstName = formData.first_name;
      newForm.LastName = formData.last_name;
      newForm.Phone = '222-222-2222';
      newForm.Email = formData.email;
      newForm.Campus__c = formData.campus === 'Austin-2nd St District' ? 'Austin-2nd Street District' : formData.campus;
      newForm.Product__c = formData.courseProduct;
      newForm.Company = 'Unknown';
      newForm.Source__c = 'Admissions Portal';
      newForm.LeadSource = 'Galvanize.com';
      newForm.LeadSourceDetail__c = 'Direct';
      newForm.pi__conversion_object_name__c = 'Admissions Portal',
      newForm.form_source__c = 'Admissions Portal',
      newForm.Has_Portal_Account__c = 'true';
      newForm.Last_Portal_Login__c = new Date();
      newForm.Privacy_Policy_Date__c = new Date();
      newForm.Terms_of_Service_Date__c = new Date();
      newForm.Code_of_Conduct_Date__c = new Date();
      newForm.Data_Use_Policy_Date__c = new Date();

      this.connection.sobject('Lead').create(newForm, (err, res) => {
        if (err) { reject(err); }
        if (!res || !res.success) { reject(res); }
        resolve(res);
      });
    });
  }

  updateLead(lead) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('Lead').update( lead , (err, res) => {
        if(err) { reject(err); }
        resolve(res);
      });
    });
  }

  updateContact(contact) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('Contact').update( contact , (err, res) => {
        if(err) { reject(err); }
        resolve(res);
      });
    });
  }

  async getOpportunities(email) {
    await this.login();

    let opps = await this.oppQuery(email)
    if (!opps.length) return []

    let scorecardIds = opps.filter(opp => opp.scorecardId).map(opp => opp.scorecardId)
    let scorecards = await this.scorecardQueries(scorecardIds);

    const opportunities = opps.map(opp => {
      let card = scorecards.find(card => card.oppId === opp.id);
      if (card) opp.scorecard = card
      return opp
    }).filter(val => val);

    return opportunities
  }


  // old from dotcom but will use on application submit
  getCampaignId(campaignType, product) {
    let isWebDev = product === 'Full Stack' || product === 'Web Development';

    if (campaignType === 'syllabus' && isWebDev) {
      return SF_WDI_SYLLABUS_CAMPAIGN_ID;
    } else if (campaignType === 'syllabus' && product === 'Data Science') {
      return SF_DSI_SYLLABUS_CAMPAIGN_ID;
    } else if (campaignType === 'application' && isWebDev) {
      return SF_WDI_APPLICATION_CAMPAIGN_ID;
    } else if (campaignType === 'application' && product === 'Data Science') {
      return SF_DSI_APPLICATION_CAMPAIGN_ID;
    } else if (campaignType === 'newsletter') {
      return SF_NEWSLETTER_CAMPAIGN_ID;
    }
  }

  getQueryString(formType, email) {
    if (formType === 'lead' || formType === 'newsletter') {
      return _makeQueryForExistingLead(email);
    } else if (formType === 'application') {
      return _makeQueryForExistingLeadForApplication(email);
    }
  }

  prepFormParamsForSFDC(formParams) {
    if (formParams.Birthdate__c) {
      let bDayParts = formParams.Birthdate__c.split('/');
      let formattedBDay = `${ bDayParts[2] }-${ bDayParts[0] }-${ bDayParts[1] }`;
      formParams.Birthdate__c = formattedBDay;
    }

    if (formParams.Product__c === 'Web Development') {
      formParams.Product__c = 'Full Stack';

    return formParams;
  }
}

  oppQuery(email) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject("Opportunity")
    .select('Id, StageName, Name, Course_Product__c, Course_Type__c, CreatedDate, Campus__c, Course_Start_Date_Actual__c, Product_Code__c, Scorecard__c')
    .where({'Student_Email__c': email})
    .orderby("CreatedDate", "DESC")
      .execute((err, res) => {
        if (err) { reject(err); }
        resolve(_reformatOppty(res));
      });
    });
  }

  scorecardQueries(ids) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject("Interview_Evaluation__c").retrieve(
        ids, function(err, scorecards) {
        if (err) { reject(err) };
        resolve(_reformatScorecard(scorecards));
      });
    });
  }

  submitCodingChallenge(oppId, code, moveForward, stage) {
    return new Promise( (resolve, reject) => {
      return Promise.all([
        this.connection.sobject('Interview_Evaluation__c')
        .find({Opportunity_Name__c: `${oppId}`})
        .update({
          Final_Code__c: code,
          Move_Forward__c: moveForward
        }, (err, res) => {
          if(err) { reject(err); }
        }),
        this.connection.sobject('Opportunity')
        .find({Id: `${oppId}`})
        .update({
          StageName: stage,
        }, (err, res) => {
          if(err) { reject(err); }
        })])
        .then(rows => {
          if (!rows) return [];
          return rows;
        }).then(resolve)
        .catch(reject)
    });
  }

  submitPythonChallenge(oppId, code, moveForward, stage, score) {
    return new Promise( (resolve, reject) => {
      return Promise.all([
        this.connection.sobject('Interview_Evaluation__c')
        .find({Opportunity_Name__c: `${oppId}`})
        .update({
          Final_Code__c: code,
          Move_Forward__c: moveForward,
          DS_Take_Home_Python_Score__c: score
        }, (err, res) => {
          if(err) { reject(err); }
        }),
        this.connection.sobject('Opportunity')
        .find({Id: `${oppId}`})
        .update({
          StageName: stage,
        }, (err, res) => {
          if(err) { reject(err); }
        })])
        .then(rows => {
          if (!rows) return [];
          return rows;
        }).then(resolve)
        .catch(reject)
    });
  }

  // query salesforce for campaign id
  leadCampaignQuery(leadId, campaignType, product) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('CampaignMember')
        .find({
          LeadId: leadId,
          CampaignId: this.getCampaignId(campaignType, product)
        }, (err, res) => {
          if(err) { reject(err); }
          resolve(res);
        });
    });
  }

  addLeadToCampaign(leadId, referrer, campaignType, product) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('CampaignMember')
        .create({
          LeadId: leadId,
          CampaignId: this.getCampaignId(campaignType, product),
          Referrer__c: referrer
        }, (err, res) => {
          if(err) { reject(err); }
          resolve(res);
        });
    });
  }

  updateOppStage(oppId, stage) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('Opportunity').update({
        Id: oppId,
        StageName: stage
      }, (err, res) => {
        if(err) { reject(err); }
        resolve(res);
      });
    });
  }

  updateScorecardMoveOn(scoreCardId, moveForward) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('Interview_Evaluation__c').update({
        Id: scoreCardId,
        Move_Forward__c: moveForward
      }, (err, res) => {
        if(err) { reject(err); }
        resolve(res);
      });
    });
  }
}

export default Salesforce;

function _reformatOppty(ogData) {
  let opptys = [];

  ogData.forEach(oppty => {
    let opptyTemplate = {};

    opptyTemplate.id = oppty['Id'];
    opptyTemplate.name = oppty['Name'];
    opptyTemplate.campus = oppty['Campus__c'];
    opptyTemplate.courseProduct = oppty['Course_Product__c'];
    opptyTemplate.courseStart = oppty['Course_Start_Date_Actual__c'];
    opptyTemplate.created_at = new Date(oppty['CreatedDate'])
    opptyTemplate.courseType = oppty['Course_Type__c'];
    opptyTemplate.productCode = oppty['Product_Code__c'];
    opptyTemplate.scorecardId = oppty['Scorecard__c'];
    opptyTemplate.stage = oppty['StageName'];
    opptyTemplate.type = 'opportunity';

    if (
      IMMERSIVE_COURSE_TYPES.includes(opptyTemplate.courseType)
      && opptyTemplate.stage !== 'Closed'
      && opptyTemplate.courseStart > moment().format('YYYY-MM-DD')
    ) {
      opptys.push(opptyTemplate);
    }
  })

  return opptys;
}

function _reformatScorecard(ogData) {
  let scorecards = [];
  let scorecardTemplate = {
    finalCode: '',
    moveForwardCode: '',
    oppId: ''
  }

  ogData.forEach( scorecard => {
    let newScorecard = Object.assign({}, scorecardTemplate);

    newScorecard.finalCode = scorecard['Final_Code__c'];
    newScorecard.moveForwardCode = scorecard['Move_Forward__c'];
    newScorecard.moveForwardInterview = scorecard['Move_Forward_m__c'];
    newScorecard.oppId = scorecard['Opportunity_Name__c'];

    scorecards.push(newScorecard);
  })

  return scorecards;
}

function _makeQueryForExistingLead(email) {
  return `SELECT Id FROM Lead
    WHERE ( RecordTypeId = '${LEAD_PROSPECT_RECORD_ID}'
    OR RecordTypeId = '${LEAD_STUDENT_RECORD_ID}' )
    AND Email = '${email}'
    ORDER BY LastModifiedDate DESC LIMIT 1`;
}

function _makeQueryForExistingLeadForApplication(email) {
  return `SELECT Id FROM Lead
    WHERE ( RecordTypeId = '${LEAD_PROSPECT_RECORD_ID}'
    OR RecordTypeId = '${LEAD_STUDENT_RECORD_ID}' )
    AND Email = '${email}'
    AND IsConverted = false
    ORDER BY LastModifiedDate DESC LIMIT 1`;
}

function _makeQueryForExistingContact(email) {
  return `SELECT Id, Name, Account.Id, Account.Name FROM Contact
    WHERE Email = '${email}'
    ORDER BY LastModifiedDate DESC LIMIT 1`;
}

function _makeQueryForExistingOpportunity(id) {
  return `SELECT Id, StageName, Name, Course_Product__c, Course_Type__c, CreatedDate, Campus__c, Course_Start_Date_Actual__c, Product_Code__c, Scorecard__c
    FROM   Opportunity
    WHERE  AccountId = '${id}'
    ORDER BY CreatedDate`;
}

function _makeSalesforceUserQuery(email) {
  let escapedEmail = email.replace(/[-[\]{}()*+?\\^$|#\s]/g, '\\$&');
  return `FIND {${escapedEmail}} IN Email FIELDS RETURNING Contact(Id, Email ORDER BY CreatedDate DESC), Opportunity(Id, Student__r.Email ORDER BY CreatedDate DESC), Lead(Id, Email ORDER BY CreatedDate DESC)`;
}
