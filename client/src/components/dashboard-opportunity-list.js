import React, { Component } from 'react';

import AdmissionsProcessList from './admissions-process-list';
import NextStepBlock from './next-steps-coding-challenge';


class OpportunityList extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    let course, nextSteps;

    let opptyList = this.props.opps.map((opp, i) => {
      let campus = opp.campus;
      nextSteps = <AdmissionsProcessList program={opp.courseProduct} opp={opp}/>
      if (opp.courseProduct === 'Web Development' && opp.courseType.includes('Immersive')) {
        if (opp.productCode && opp.productCode.includes('-WD-')) {
          if (opp.productCode && opp.productCode.includes('-WD-REM')) {
            course = 'Software Engineering Remote Immersive';
          }
          if (opp.productCode && opp.productCode.includes('-WD-RPT')) {
            course = 'Software Engineering Remote Part-Time Immersive';
            campus = 'Remote';

          } else {
            course = 'Software Engineering Immersive';
          }
        }
      } else if (opp.productCode && opp.productCode.includes('-DS-')  && opp.courseType.includes('Immersive')) {
            course = 'Data Science Immersive';
      } else {
        return null;
      }
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{course}</li>
            <li>{campus}</li>
            <li>{opp.courseStart}</li>
            <li>Awaiting Coding Challenge</li>
          </ul>
          <div className="table-row -steps">
            {nextSteps}
          </div>
          <NextStepBlock oppId={opp.id}/>
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
