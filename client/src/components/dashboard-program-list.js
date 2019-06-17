import React from 'react';

import AdmissionsProcessSteps from './admissions-process-steps';
import NextStepBlock from './next-steps-block';
import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import moment from 'moment';

const ProgramList = ({ applications }) => (
  <div className="table">
    <div className="table-head">
      <ul className="table-row">
        <li>Your Active Applications</li>
        <li className="hide-mobile">Campus</li>
        <li className="hide-mobile">Start Date</li>
        <li className="hide-tablet">Next Step</li>
      </ul>
    </div>
    <div className="table-body">
      {applications.map((application, i) => (
        <div className="application-row" key={`application-${application.id}`}>
          <ul className="table-row -listing">
            <li>{application.formalName}</li>
            <li className="hide-mobile">{application.values ? application.values.Campus__c : application.campus}</li>
            <li className="hide-mobile">{moment(application.courseStart).format('MM/DD/YYYY')}</li>
            <li className="hide-tablet">{application.currentStep ? application.currentStep.status : 'Talk to Your Enrollment Officer'}</li>
          </ul>
          {i < 1 && <AdmissionsProcessSteps admissionsProcess={application.admissionsProcess} activeStep={application.currentStep} />}
          <NextStepBlock opp={application} step={application.currentStep} />
          {i < 1 && (application.courseProduct === 'Data Science' ? <ResourcesDSI /> : <ResourcesSEI />)}
        </div>
      ))}
    </div>
  </div>
);

export default ProgramList;
