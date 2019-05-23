import React from 'react';

import { SEI_STEPS_12_WK } from '../constants';


import checkMark from '../assets/images/icon-checkmark-orange.png';



export default (props) => {
  let list = props.opp.admissionsProcess.map((step, i) => {
    if (step.status.includes('Enroll') || step.status.includes('Hold') || step.hidden) return null;
    if (props.opp.currentStep &&  props.opp.currentStep.step > step.step) {
      return (
        <div className="step" key={i}>
          <span className="number -complete"><img alt=""src={checkMark}></img></span>
          <span className="label">{step.status}</span>
        </div>
      )
    } else if (props.opp.currentStep === step.step) {
      return (
      <div className="step" key={i}>
        <span className="number -active">{step.step}</span>
        <span className="label">{step.status}</span>
      </div>
      )
    }
    return (
      <div className="step" key={i}>
        <span className="number">{step.step}</span>
        <span className="label">{step.status}</span>
      </div>
    )
  })

  return (
    <div className="admissions-steps">
      <div className="table-row -steps">
        <div className="steps-list">
          <div className="steps">
              {list}
            </div>
        </div>
    </div>
  </div>
  )
}
