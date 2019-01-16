import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NextSteps from './sei-steps-process';

class OpportunityList extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    let course;

    let opptyList = this.props.opps.map((opp, i) => {
      let campus = opp.Campus__c;
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
      } else if (opp.Product_Code__c && opp.Product_Code__c.includes('-DS-')) {
            course = 'Data Science Immersive';
      } else {
        return null;
      }
      return (
        <div className="application-row">
          <ul key={i} className="table-row">
            <li>{course}</li>
            <li>{campus}</li>
            <li>{opp.Course_Start_Date_Actual__c}</li>
            <li>{opp.StageName}</li>
            <li>Coding Challenge</li>
          </ul>
          <div className="table-row -steps">
            <NextSteps />
          </div>
        </div>
      )
    })

  return (
    <div className="table">
        <div className="table-head">
          <ul className="table-row">
            <li>Course</li>
            <li>Campus</li>
            <li>Start Date</li>
            <li>Status</li>
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
