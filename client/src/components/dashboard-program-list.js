import React from 'react';

import AdmissionsProcessSteps from './admissions-process-steps';
import NextStepBlock from './next-steps-block';
import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import moment from 'moment';

const ProgramList = ({ opps }) => (
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
      {opps.map((opp, i) => (
        <div className="application-row" key={`application-${opp.id}`}>
          <ul className="table-row -listing">
            <li>{opp.formalName}</li>
            <li className="hide-mobile">{opp.values ? opp.values.Campus__c : opp.campus}</li>
            <li className="hide-mobile">{moment(opp.courseStart).format('MM/DD/YYYY')}</li>
            <li className="hide-tablet">{opp.currentStep ? opp.currentStep.status : 'Talk to Your Enrollment Officer'}</li>
          </ul>
          {i < 1 && <AdmissionsProcessSteps opp={opp} activeStep={opp.currentStep} />}
          <NextStepBlock opp={opp} step={opp.currentStep} />
          {i < 1 && (opp.courseProduct === 'Data Science' ? <ResourcesDSI /> : <ResourcesSEI />)}
        </div>
      ))}
    </div>
  </div>
);

export default ProgramList;
