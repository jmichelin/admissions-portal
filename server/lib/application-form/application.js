

import _ from 'lodash';
import inputs from '../../components/forms/application/application-inputs';
import { CAMPUSES } from '../constants';

class Application {
  constructor(course) {
    if (course === 'web-development') this.course = 'Web Development';
    else if (course === 'data-science') this.course = 'Data Science';
    else this.course = course;
  }

  validateInitialStep(formParams) {
    const requiredFields = [
      'Campus__c',
      'FirstName',
      'LastName',
      'Email'
    ];


    requiredFields.forEach((field) => {
      if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
    });

    this.validateCampus(formParams.Campus__c);
  }

  validateStepOne(formParams) {
    const requiredFields = [
      'Campus__c',
      'Which_dates_you_prefer_to_take_course__c',
      'Phone',
      'Birthdate__c',
      'International__c'
    ];

    const nonCitizenRequired = [
      'Authorize_to_work_in_US__c',
      'visa_status_For_international_student__c',
      'Citizenship__c'
    ];

    requiredFields.forEach((field) => {
      if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
    });

    if (formParams.International__c === 'true') { // may need to change depending on sfdc reqs for Citizenship__c field
      nonCitizenRequired.forEach((field) => {
        if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
      });
    }

    this.validateCampus(formParams.Campus__c);
  }

  validateStepTwo(formParams) {
    const requiredFields = [
      'Highest_Degree__c',
      'Year_of_work_experience__c'
    ];

    if (this.course === 'Data Science') { requiredFields.unshift('How_much_experience_with_Python__c', 'Github_URL__c'); }

    requiredFields.forEach((field) => {
      if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
    });
  }

  validateStepThree(formParams) {
    const requiredFields = [
      'Reason_applying_to_this_gSchool_Program__c',
      'Goals_afte_gSchool_s_Immersive_Program__c',
      'Complex_or_Technical_problems_approach__c',
      'Is_Eighteen',
      'Terms'
    ];

    requiredFields.forEach((field) => {
      if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
    });
  }

  validateStepFour(formParams) {
    const requiredFields = [
      'EthnicityNew__c',
      'Veteran__c',
      'How_did_you_hear_about_gSchool__c'
    ];

    requiredFields.forEach((field) => {
      if (!formParams[field]) throw new Error(`Error: ${field} is required.`);
    });
  }

  validateCampus(campus) {
    // This fails for Austin when I select Austin manually from the dropdown
    if (_.find(CAMPUSES, { sfdcName: campus }) || campus === 'Austin-2nd Street District') {
      return;
    }

    throw new Error(`Error: campus ${campus} is not a valid campus.`);
  }

  get initialStepParams() {
    return inputs.leadInputs.map(input => input.fieldName);
  }

  get stepOneParams() {
    return inputs.wdi.stepOne.map(input => input.fieldName);
  }

  get stepTwoParams() {
    if (this.course === 'Data Science') { return inputs.dsi.stepTwo.map(input => input.fieldName); }
    return inputs.wdi.stepTwo.map(input => input.fieldName);
  }

  get stepThreeParams() {
    return inputs.wdi.stepThree.map(input => input.fieldName);
  }

  get stepFourParams() {
    return inputs.wdi.stepFour.map(input => input.fieldName);
  }

  validateStep(step, formParams) {
    switch (step) {
      case 'initial':
        return this.validateInitialStep(formParams);
      case 'one':
        return this.validateStepOne(formParams);
      case 'two':
        return this.validateStepTwo(formParams);
      case 'three':
        return this.validateStepThree(formParams);
      case 'four':
        return this.validateStepFour(formParams);
      default:
        throw new Error(`Step ${step} is not supported.`);
    }
  }

}

export default Application;
