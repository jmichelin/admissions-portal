import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OpportunityList extends Component {
  constructor(props){
    super(props);

    this.state = {
    }
  }


  render() {
    let opptyList = this.props.opps.map((opp, i) => {
      return <p className="section-row" key={i}>{opp.Course_Product__c}, {opp.Campus__c}, {opp.Course_Start_Date_Actual__c}</p>
    })

  return (
    <div>
      {opptyList}
    </div>
    )
  }
}

export default OpportunityList;
