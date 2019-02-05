import React, { Component } from 'react';

import AdmissionsProcessList from './admissions-process-list';
import NextStepBlock from './next-steps-block';

import utils from '../helpers/utils';
import moment from 'moment';

class OpportunityList extends Component {
  constructor(props){
    super(props);
  }


  render() {
    let nextSteps;

    let opptyList = this.props.opps.map((opp, i) => {
    let course = utils.getCourseName(opp).course;
    let campus = utils.getCourseName(opp).campus;
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{course}</li>
            <li>{campus}</li>
            <li>{moment(opp.courseStart).format('MM/DD/YYYY')}</li>
            <li>{opp.currentStep.status}</li>
          </ul>
          <div className="table-row -steps">
            <AdmissionsProcessList program={opp.courseProduct} currentStep={opp.currentStep} opp={opp}/>
          </div>
          <NextStepBlock opp={opp} currentStep={opp.currentStep}/>
        </div>
      )
    })

  return (
    <div className="table">
        <div className="table-head">
          <ul className="table-row">
            <li>Your Active Applications</li>
            <li>Campus</li>
            <li>Start Date</li>
            <li>Next Step</li>
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
