

import _ from 'lodash';
import randToken from 'rand-token';

import Form from '../form';
import validate from '../validate';
import Application from './application';


class ApplicationForm extends Form {
  constructor(jsforce, req, applicationType, currentStep, token = randToken.generate(10)) {
    super(req);
    this.jsforce = jsforce;
    this.applicationType = applicationType;
    this.token = token;
    this.saveStepToSalesforce = this.saveStepToSalesforce.bind(this);
    this.setApplicationClass(applicationType);
    this.setCurrentStep(currentStep);
  }

  setApplicationClass(applicationType) {
    if (applicationType === 'web-development' || applicationType === 'data-science') {
      this.applicationClass = new Application(applicationType);
    } else {
      throw new Error('Invalid application type');
    }
  }

  setCurrentStep(step) {
    this.currentStep = step;
  }

  setToken(token) {
    this.token = token;
  }

  hasToken() {
    return !!this.token;
  }

  isValid(step) {
    return new Promise((resolve, reject) => {
      try {
        if (this.formType !== 'application') {
          throw new Error(`Invalid Form Type: ${this.formType}`);
        }

        if (!super.hasReferrer()) {
          throw new Error('Error: Form does not have a referrer');
        }
        if (!this.hasToken()) {
          throw new Error('Error: Form does not have a token');
        }

        // this will throw an error if invalid
        this.applicationClass.validateStep(step, this.formParams);

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  save() {
    return this.isValid(this.currentStep)
      .then(() => {
        if (this.currentStep === 'initial') {
          return super.save();
        }
        return super.save(this.saveStepToSalesforce);
      });
  }

  saveStepToSalesforce() {
    let func;
    switch (this.currentStep) {
      case 'one':
        func = 'updateApplicationStepOne';
        break;

      case 'two':
        func = 'updateApplicationStepTwo';
        break;

      case 'three':
        func = 'updateApplicationStepThree';
        break;

      case 'four':
        func = 'updateApplicationStepFour';
        break;
    }
    let formParams;

    // query our database for the application matching this token
    return super.getApplicationBasedOnToken(this.token)
      .then((applicant) => {
        formParams = applicant;
        return this.jsforce.login();
      })
      .then(() =>
        // find the lead with the email
         this.jsforce.leadQuery(this.formType, formParams))
      .then((res) => {
        // set leadId and update existing record
        const leadId = res.records[0] && res.records[0].Id;

        return this.jsforce[func](this.formParams, leadId);
      })
      .catch((err) => {
        throw new Error(`Saving step ${this.currentStep} to Salesforce => ${err}`);
      });
  }

}

export default ApplicationForm;
