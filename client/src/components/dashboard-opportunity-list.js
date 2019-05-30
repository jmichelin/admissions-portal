import React, { Component } from 'react';

import AdmissionsProcessSteps from './admissions-process-steps';
import NextStepBlock from './next-steps-block';
import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import utils from '../helpers/utils';
import moment from 'moment';

import { SEI_STEPS_12_WK } from '../constants';


class OpportunityList extends Component {

  render() {
    let opptyList = this.props.opps.map((opp, i) => {
    let activeStep = SEI_STEPS_12_WK.HOLD;
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{opp.formalName}</li>
            <li className="hide-mobile">{opp.campus}</li>
            <li className="hide-mobile">{moment(opp.courseStart).format('MM/DD/YYYY')}</li>
            <li className="hide-tablet">{opp.currentStep ? opp.currentStep.status : 'Talk to Your Enrollment Officer'}</li>
          </ul>
          <AdmissionsProcessSteps opp={opp} activeStep={activeStep}/>
            <NextStepBlock opp={opp} step={activeStep}/>
            {opp.courseProduct === 'Web Development' ? <ResourcesSEI/> : <ResourcesDSI/>}
        </div>
      )
    })

  return (
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
          {opptyList}
        </div>
    </div>
    )
  }
}

export default OpportunityList;
