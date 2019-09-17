'use strict';

import jsforce from 'jsforce';
import moment from 'moment';
import {
  LEAD_PROSPECT_RECORD_ID,
  LEAD_STUDENT_RECORD_ID,
  OPP_STUDENT_RECORD_ID,
  SF_WDI_SYLLABUS_CAMPAIGN_ID,
  SF_WDI_APPLICATION_CAMPAIGN_ID,
  SF_DSI_SYLLABUS_CAMPAIGN_ID,
  SF_DSI_APPLICATION_CAMPAIGN_ID,
  SF_NEWSLETTER_CAMPAIGN_ID,
  IMMERSIVE_COURSE_TYPES
} from '../constants';

const Q = require('../db/queries');
var dotenv = require('dotenv');
var environment = process.env.NODE_ENV || 'development';
if (environment === 'development' || environment === 'test') {
  dotenv.config();
}

import sfdcUtils from './salesforce-utils';

class Salesforce {
  constructor() {
    this.username = process.env.SF_USERNAME;
    this.password = process.env.SF_PASSWORD;
    this.baseUrl = process.env.SF_OAUTH_BASE_URL;
    this.connection = new jsforce.Connection({ loginUrl : this.baseUrl });
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

  async applicationStepUpdate(user, application, applicationComplete) {
    if (user.salesforce_type === "Contact") {
      let contact = {
        Id: user.salesforce_id,
        Has_Portal_Account__c: true,
        Last_Portal_Login__c: new Date(),
        Campus__c: sfdcUtils.normalizeAustin(application.values.Campus__c)
      }

      await this.updateContact(contact);

      if (applicationComplete) {
        let cleanContact = sfdcUtils.salesforceFieldSanitizer(application.values, 'Contact');
        cleanContact.Id = user.salesforce_id,
        cleanContact.Last_Portal_Login__c = new Date();
        await this.updateContact(cleanContact);

        let courseInfo = await Q.getCourseByName(application.values.Which_dates_you_prefer_to_take_course__c);
        if (courseInfo && courseInfo.rows && courseInfo.rows.length) {
          await this.createOpp(user, courseInfo.rows[0].off, application.values);
        } else {
          throw new Error('Error retrieving correct course for opportunity.')
        }
      }
    } else if (user.salesforce_type === "Lead") {
      let lead = applicationComplete ? application.values : {};
        lead.Id = user.salesforce_id;
        lead.Campus__c = sfdcUtils.normalizeAustin(application.values.Campus__c);
        lead.Product__c = application.courseProduct;
        lead.Status = "Started Application";
        lead.Which_dates_you_prefer_to_take_course__c = application.values.Which_dates_you_prefer_to_take_course__c;
        lead.Course_to_which_you_are_applying__c - sfdcUtils.reformatCourseToWhichApplying(application.courseProduct);
        lead.Application_Completed__c = applicationComplete;
        let cleanLead = sfdcUtils.prepLeadParamsforSFDC(lead)
      await this.updateLead(cleanLead);
    }
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
        Phone: requestbody.phone,
        Campus__c: sfdcUtils.normalizeAustin(requestbody.campus),
        Product__c: requestbody.courseProduct,
        Has_Portal_Account__c: true,
        Last_Portal_Login__c: new Date()
      };

      await this.updateContact(contact);
    }

    // if no contact look for lead and update lead
    if (!salesforceUser) {
      salesforceUser = searchResponse.searchRecords.find(record => record.attributes.type === 'Lead');
      if (salesforceUser && !salesforceUser.IsConverted){
        let lead = {
          RecordTypeId: LEAD_STUDENT_RECORD_ID,
          Id: salesforceUser.Id,
          FirstName: requestbody.first_name,
          LastName: requestbody.last_name,
          Phone: requestbody.phone,
          Campus__c: sfdcUtils.normalizeAustin(requestbody.campus),
          Product__c: requestbody.courseProduct,
          Has_Portal_Account__c: true,
          Last_Portal_Login__c: new Date()
        }
        await this.updateLead(lead);
      }
    }

    //if no contact or lead create a lead
    if (!salesforceUser || salesforceUser.IsConverted) {
      let newLead = await this.createLead(requestbody);
      salesforceUser = { Id: newLead.id, attributes: {type: 'Lead'}};
    }

    return salesforceUser;
  }

  async createLead(leadData) {
    return new Promise( (resolve, reject) => {
      let lead = {
        RecordTypeId: LEAD_STUDENT_RECORD_ID,
        FirstName: leadData.first_name,
        LastName: leadData.last_name,
        Phone: leadData.phone,
        Email: leadData.email,
        Campus__c: sfdcUtils.normalizeAustin(leadData.campus),
        Product__c: leadData.courseProduct,
        Company: 'Unknown',
        Source__c: 'Admissions Portal',
        LeadSource: leadData.LeadSource,
        LeadSourceDetail__c: leadData.LeadSourceDetail__c,
        pi__utm_source__c: leadData.pi__utm_source__c,
        pi__utm_medium__c: leadData.pi__utm_medium__c,
        pi__utm_campaign__c: leadData.pi__utm_campaign__c,
        pi__conversion_object_name__c: 'Admissions Portal',
        form_source__c: 'Admissions Portal',
        Has_Portal_Account__c: 'true',
        Last_Portal_Login__c: new Date(),
        Privacy_Policy_Date__c: new Date(),
        Terms_of_Service_Date__c: new Date(),
        Code_of_Conduct_Date__c: new Date(),
        Data_Use_Policy_Date__c: new Date()
      };

      this.connection.sobject('Lead').create(lead, (err, res) => {
        if (err) { reject(err); }
        if (!res || !res.success) { reject(res); }
        resolve(res);
      });
    });
  }

  async createOpp(user, courseInfo, application) {
    let cleanOppty = sfdcUtils.salesforceFieldSanitizer(application, 'Opportunity')
    let searchResponse = await this.findSalesforceUser(user.email);
    let salesforceUser = await searchResponse.searchRecords.find(record => record.attributes.type === 'Contact');
    let accountId;
    if (salesforceUser) {
      accountId = salesforceUser.AccountId;
    }
    return new Promise( (resolve, reject) => {
        cleanOppty.RecordTypeId = OPP_STUDENT_RECORD_ID;
        cleanOppty.Name = user.name + " " + courseInfo.cohortCode + " Application";
        cleanOppty.CloseDate = new Date();
        cleanOppty.Course__c = courseInfo.courseId;
        cleanOppty.Student__c = user.salesforce_id;
        cleanOppty.AccountId = accountId;
        cleanOppty.StageName = "New";
        cleanOppty.Course_to_which_you_are_applying__c = sfdcUtils.reformatCourseToWhichApplying(application.course_product);

      this.connection.sobject('Opportunity').create(cleanOppty, (err, res) => {
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
        Move_Forward__c: moveForward,
        Comments_on_Test__c: 'rec_dig_sums_challenge and sigmoid_challenge'
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
  return `FIND {${escapedEmail}} IN ALL FIELDS RETURNING Contact(Id, AccountId, Email ORDER BY CreatedDate DESC), Opportunity(Id, Student__r.Email ORDER BY CreatedDate DESC), Lead(Id, Email, isConverted ORDER BY CreatedDate DESC)`;
}
