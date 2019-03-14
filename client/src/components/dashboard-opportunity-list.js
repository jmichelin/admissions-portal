import React, { Component } from 'react';

import AdmissionsProcessList from './admissions-process-list';

import utils from '../helpers/utils';
import moment from 'moment';

class OpportunityList extends Component {

  render() {
    let opptyList = this.props.opps.map((opp, i) => {
    let course = utils.getCourseName(opp).course;
    let campus = utils.getCourseName(opp).campus;
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{course}</li>
            <li className="hide-mobile">{campus}</li>
            <li className="hide-mobile">{moment(opp.courseStart).format('MM/DD/YYYY')}</li>
            <li className="hide-tablet">{opp.currentStep ? opp.currentStep.status : 'Talk to Your Enrollment Officer'}</li>
          </ul>
          <AdmissionsProcessList opp={opp}/>
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
