import React, { Component } from 'react';

import AdmissionsProcessList from './admissions-process-list';
import NextStepBlock from './next-steps-block';

import utils from '../helpers/utils';
import moment from 'moment';

class OpportunityList extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    let nextSteps;

    let opptyList = this.props.opps.map((opp, i) => {
    let stage = opp.courseProduct === 'Web Development' ? utils.getSEIStage(opp) : utils.getDSIStage(opp);
    let course = utils.getCourseName(opp).course;
    let campus = utils.getCourseName(opp).campus;
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{course}</li>
            <li>{campus}</li>
            <li>{moment(opp.courseStart).format('MM/DD/YYYY')}</li>
            <li>{stage.status}</li>
          </ul>
          <div className="table-row -steps">
            <AdmissionsProcessList program={opp.courseProduct} stage={stage} opp={opp}/>
          </div>
          <NextStepBlock opp={opp} stage={stage}/>
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
            <li>Status</li>
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
