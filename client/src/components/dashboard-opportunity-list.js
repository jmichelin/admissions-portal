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
      let campus = opp.Campus__c;
      nextSteps = <AdmissionsProcessList program={opp.Course_Product__c} opp={opp}/>
      if (opp.Course_Product__c === 'Web Development' && opp.Course_Type__c.includes('Immersive')) {
        if (opp.Product_Code__c && opp.Product_Code__c.includes('-WD-')) {
          if (opp.Product_Code__c && opp.Product_Code__c.includes('-WD-REM')) {
            course = 'Software Engineering Remote Immersive';
          }
          if (opp.Product_Code__c && opp.Product_Code__c.includes('-WD-RPT')) {
            course = 'Software Engineering Remote Part-Time Immersive';
            campus = 'Remote';

          } else {
            course = 'Software Engineering Immersive';
          }
        }
      } else if (opp.Product_Code__c && opp.Product_Code__c.includes('-DS-')  && opp.Course_Type__c.includes('Immersive')) {
            course = 'Data Science Immersive';
      } else {
        return null;
      }
      return (
        <div className="application-row" key={i}>
          <ul className="table-row -listing">
            <li>{course}</li>
            <li>{campus}</li>
            <li>{opp.Course_Start_Date_Actual__c}</li>
          </ul>
          <div className="table-row -steps">
            {nextSteps}
          </div>
          <NextStepBlock opp={opp}/>
        </div>
      )
    })

  return (
    <div className="table">
        <div className="table-head">
          <ul className="table-row">
            <li>Your Applications</li>
            <li>Campus</li>
            <li>Start Date</li>
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
