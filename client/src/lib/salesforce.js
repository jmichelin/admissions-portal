'use strict';

import jsforce from 'jsforce';
import _ from 'lodash';

// import DB from './db';
// import utils from './utils';
import {
  PROSPECT_RECORD_ID,
  STUDENT_RECORD_ID,
  SF_WDI_SYLLABUS_CAMPAIGN_ID,
  SF_WDI_APPLICATION_CAMPAIGN_ID,
  SF_DSI_SYLLABUS_CAMPAIGN_ID,
  SF_DSI_APPLICATION_CAMPAIGN_ID,
  SF_NEWSLETTER_CAMPAIGN_ID,
  CAMPUSES
} from '../constants';
// import Application from './application-form/application';

var dotenv = require('dotenv');
var environment = process.env.NODE_ENV || 'development';
if (environment === 'development' || environment === 'test') {
  dotenv.config();
}

const sfdcAllCourseQuery = `SELECT Id, Course_Start_Date__c, Course_End_date__c, Q2_Start_Date__c, Q3_Start_Date__c, Campus__c, ProductCode, Course_Product__c, Name, Course_Type__c, Info_Session_URL__c, Class_ScheduleFx__c, Regulatory_Course_Product_Name__c, Nights_Weekends_Course__c
FROM Product2
WHERE (Course_End_date__c > TODAY or Course_Type__c = 'Online Plus Part-Time')
AND RecordType.DeveloperName = 'Course'
AND isActive = true`

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

  getAllCourses() {
    return new Promise( (resolve, reject) => {
      this.connection.query(
        sfdcAllCourseQuery,
      (err, res) => {
        if(err) reject(err);
        resolve(_reformatData(res.records));
      });
    });
  }

  // Only to be used for Campus Pages
  getAllCoursesForLocation(location) {
    let queryString = `${sfdcAllCourseQuery} AND Campus__c = '${location}'`;

    if(location.includes('Denver')) {
      queryString = `${sfdcAllCourseQuery} AND (Campus__c = 'Denver-Golden Triangle' OR Campus__c = 'Denver-Platte')`;
    }

    if (location === 'Austin-2nd Street District') {
      queryString = `${sfdcAllCourseQuery} AND Campus__c = 'Austin-2nd St District'`;
    }

    return new Promise( (resolve, reject) => {
      this.connection.query(
        queryString,
      (err, res) => {
        if(err) reject(err);
        resolve(_reformatData(res.records));
      });
    });
  }

  updateDBCourses(sfCampuses) {
    return new Promise( (resolve, reject) => {
      sfCampuses.forEach( campus => {
        let campusMatch = _.find(CAMPUSES, { sfdcName: campus.campus });

        if (campus.campus && campus.campus.includes('Austin')) {
          campusMatch = _.find(CAMPUSES, { sfdcName: 'Austin-2nd St District' })
        }
        if(!campusMatch) return;

        this.getPagesByLocation(campusMatch)
          .then( locationPages => {
            return this.updateCourseByLocation(locationPages, campus)
              .then(utils.clearVarnishCache)
              .catch(reject);
          })
          .catch(reject);
      });
      resolve();
    });
  }

  getPagesByLocation(campus) {
    return DB.getPageBy('location', campus.name)
  }

  updateApplicationCourses(sfCampuses) {
    return new Promise( (resolve, reject) => {
      return Promise.all([DB.getPageBy('page', 'web-development-application'), DB.getPageBy('page', 'data-science-application')])
        .then(rows => {
          if (!rows) return [];
          return rows;
        })
        .then(rows => {
          let courses = _
            .chain(sfCampuses)
            .map('courses')
            .flatten()
            .filter(course => course.courseType.includes('Immersive'))
            .value()

          rows.forEach(row => {
            return DB.updatePageCourses(row[0].contentful_id, courses)
              .catch(reject);
          })
        })
        resolve();
    });
  }

  updateLeadFormCourses(sfCampuses) {
    return new Promise( (resolve, reject) => {
      return Promise.all([
        DB.getPageByTemplate('Lead Form'),
        DB.getPageByTemplate('Lead Form Version 2'),
        DB.getPageByTemplate('Lead Form Email'),
        DB.getPageByTemplate('Immersive Course v2'),
        DB.getPageByTemplate('Course Collection v2'),
        DB.getPageByTemplate('Part Time Course v2'),
        DB.getPageByTemplate('Course Collection'),
        DB.getPageByTemplate('Campus'),
        DB.getPageByTemplate('Event Collection v2')])
        .then(rows => {
          if (!rows) return [];
          return rows;
        })
        .then(rows => {
          let courses = _
            .chain(sfCampuses)
            .map('courses')
            .flatten()
            .filter(course => Date.parse(course.endDate) > Date.now())
            .value()
          rows.forEach(row => {
            row.forEach(template => {
              return DB.updatePageCourses(template.contentful_id, courses)
                .catch(reject);
            })

          })
        })
        resolve();
    });
  }

  updateCourseByLocation(locationPages, campus) {
    return new Promise( (resolve, reject) => {
      locationPages.forEach( page => {
        return DB.updatePageCourses(page.contentful_id, campus.courses)
          .catch(reject);
      });
      resolve();
    });
  }

  // Begin Form Service Stuff

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

  createLead(formParams, formType) {
    return new Promise( (resolve, reject) => {
      if (formType === 'application') {
        formParams.LeadSource = 'Galvanize.com';
        formParams.Status = 'Started Application';
        formParams.LeadSourceDetail__c = 'Direct';
      }
      if (formType === 'newsletter') {
        formParams.LeadSource = 'Galvanize.com';
        formParams.LeadSourceDetail__c = 'Direct';
      }

      formParams = this.prepFormParamsForSFDC(formParams);

      this.connection.sobject('Lead').create(formParams, (err, res) => {
        if (err) { reject(err); }
        if (!res || !res.success) { reject(res); }
        resolve(res);
      });
    });
  }

  updateLead(formParams, leadId) {
    return new Promise( (resolve, reject) => {
      this.connection.sobject('Lead').update({
        Id: leadId,
        FirstName: formParams.FirstName,
        LastName: formParams.LastName,
        Campus__c: formParams.Campus__c,
        pi__first_touch_url__c: formParams.pi__first_touch_url__c,
        pi__conversion_object_name__c: formParams.pi__conversion_object_name__c,
        Privacy_Policy_Date__c: formParams.Privacy_Policy_Date__c,
        Terms_of_Service_Date__c: formParams.Privacy_Policy_Date__c,
        Code_of_Conduct_Date__c: formParams.Privacy_Policy_Date__c,
        Data_Use_Policy_Date__c: formParams.Privacy_Policy_Date__c
      }, (err, res) => {
        if(err) { reject(err); }
        resolve(res);
      });
    });
  }

  prepFormParamsForSFDC(formParams) {
    if (formParams.Birthdate__c) {
      let bDayParts = formParams.Birthdate__c.split('/');
      let formattedBDay = `${ bDayParts[2] }-${ bDayParts[0] }-${ bDayParts[1] }`;
      formParams.Birthdate__c = formattedBDay;
    }

    if (formParams.Product__c === 'Web Development') {
      formParams.Product__c = 'Full Stack';
      formParams.Course_to_which_you_are_applying__c = 'Full Stack Immersive';
    } else if (formParams.Product__c === 'Data Science') {
      formParams.Course_to_which_you_are_applying__c = 'Data Science Immersive';
    }

    formParams = _.omit(formParams, 'Is_Eighteen');
    formParams = _.omit(formParams, 'Terms');
    formParams = _.omit(formParams, 'Valid_Information');

    return formParams;
  }

  // updateApplicationStepOne(formParams, leadId) {
  //   return new Promise( (resolve, reject) => {
  //     let application = new Application(formParams.Product__c);
  //     let formData = {};
  //     formData.Id = leadId;
  //
  //     application.stepOneParams.forEach(param => {
  //       formData[param] = formParams[param];
  //     });
  //
  //    formData = this.prepFormParamsForSFDC(formData);
  //
  //     this.connection.sobject('Lead').update(formData, (err, res) => {
  //       if(err) reject(err);
  //       resolve(res);
  //     });
  //   });
  // }

  // updateApplicationStepTwo(formParams, leadId) {
  //   return new Promise( (resolve, reject) => {
  //     let application = new Application(formParams.Product__c);
  //     let formData = {};
  //     formData.Id = leadId;
  //
  //     application.stepTwoParams.forEach(param => {
  //       formData[param] = formParams[param];
  //     });
  //
  //     formData = this.prepFormParamsForSFDC(formData);
  //
  //     this.connection.sobject('Lead').update(formData, (err, res) => {
  //       if(err) { reject(err); }
  //       resolve(res);
  //     });
  //   });
  // }

  // updateApplicationStepThree(formParams, leadId) {
  //   return new Promise( (resolve, reject) => {
  //     let application = new Application(formParams.Product__c);
  //     let formData = {};
  //     formData.Id = leadId;
  //
  //     application.stepThreeParams.forEach(param => {
  //       formData[param] = formParams[param];
  //     });
  //
  //     formData = this.prepFormParamsForSFDC(formData);
  //
  //     this.connection.sobject('Lead').update(formData, (err, res) => {
  //       if(err) { reject(err); }
  //       resolve(res);
  //     });
  //   });
  // }
  //
  // updateApplicationStepFour(formParams, leadId) {
  //   return new Promise( (resolve, reject) => {
  //     let application = new Application(formParams.Product__c);
  //     let formData = {};
  //     formData.Id = leadId;
  //
  //     application.stepFourParams.forEach(param => {
  //       formData[param] = formParams[param];
  //     });
  //
  //     formData = this.prepFormParamsForSFDC(formData);
  //     formData.Application_Completed__c = true;
  //     formData.LeadSource = 'Galvanize.com';
  //
  //     this.connection.sobject('Lead').update(formData, (err, res) => {
  //       if(err) { reject(err); }
  //       resolve(res);
  //     });
  //   });
  // }

  leadQuery(formType, formParams) {
    let queryString = this.getQueryString(formType, formParams.Email);

    return new Promise( (resolve, reject) => {
      this.connection.query(
        queryString,
      (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
    });
  }

  contactQuery(email) {
    let queryString = _makeQueryForExistingContact(email);
    return new Promise( (resolve, reject) => {
      this.connection.query(
        queryString,
      (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
    });
  }

  oppQuery(id) {
    let queryString = _makeQueryForExistingOpportunity(id);
    return new Promise( (resolve, reject) => {
      this.connection.query(
        queryString,
      (err, res) => {
        if (err) { reject(err); }
        resolve(res);
      });
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

}

export default Salesforce;

function _reformatData(ogData) {
  let courses = [];
  let courseTemplate = {
    campus: '',
    startDate: '',
    endDate: '',
    courseProduct: '',
    courseId: '',
    cohortCode: '',
    courseName: '',
    q2StartDate: '',
    q3StartDate: '',
    classSchedule: '',
    nightsWeekendsCourse: false,
    EBUrl: '',
    infoSessionURL: '',
    regulatoryCourseProductName: ''
  }

  ogData.forEach( course => {
    let newCourse = Object.assign({}, courseTemplate);

    newCourse.campus = course['Campus__c'];
    newCourse.startDate = course['Course_Start_Date__c'];
    newCourse.endDate = course['Course_End_date__c'];
    newCourse.courseProduct = course['Course_Product__c'];
    newCourse.courseId = course['Id'];
    newCourse.cohortCode = course['ProductCode'];
    newCourse.courseName = course['Name'];
    newCourse.courseType = course['Course_Type__c'];
    newCourse.nightsWeekendsCourse = course['Nights_Weekends_Course__c'];
    newCourse.q2StartDate = course['Q2_Start_Date__c'];
    newCourse.q3StartDate = course['Q3_Start_Date__c'];
    newCourse.classSchedule = course['Class_ScheduleFx__c'];
    newCourse.EBUrl = course['Eventbrite_URL__c	'];
    newCourse.infoSessionURL = course['Info_Session_URL__c'];
    newCourse.regulatoryCourseProductName = course['Regulatory_Course_Product_Name__c'];


    courses.push(newCourse);
  })

  return courses;
}

function _makeQueryForExistingLead(email) {
  return `SELECT Id FROM Lead
    WHERE ( RecordTypeId = '${PROSPECT_RECORD_ID}'
    OR RecordTypeId = '${STUDENT_RECORD_ID}' )
    AND Email = '${email}'
    ORDER BY LastModifiedDate DESC LIMIT 1`;
}

function _makeQueryForExistingLeadForApplication(email) {
  return `SELECT Id FROM Lead
    WHERE ( RecordTypeId = '${PROSPECT_RECORD_ID}'
    OR RecordTypeId = '${STUDENT_RECORD_ID}' )
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
  return `SELECT Id, StageName, Name, Course_Product__c, Course_Type__c, CreatedDate, Campus__c, Course_Start_Date_Actual__c
    FROM   Opportunity
    WHERE  AccountId = '${id}'
    ORDER BY CreatedDate`;
}
