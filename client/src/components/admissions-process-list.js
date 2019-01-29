import React from 'react';

import checkMark from '../assets/images/icon-checkmark-orange.png';

import { APPLICATION_STEPS_SEI } from '../constants';


export default (props) => {

  let list = APPLICATION_STEPS_SEI.map((step, i) => {
    if (step.status === "On Hold" || step.status === "Final Decision") return null;
    if (props.currentStep.step > step.step) {
      return (
        <div className="step" key={i}>
          <span className="number -complete"><img src={checkMark}></img></span>
          <span className="label">{step.status}</span>
        </div>
      )
    }
    return (
      <div className="step" key={i}>
        <span className="number">{i+1}</span>
        <span className="label">{step.status}</span>
      </div>
    )
  })

  return (
    <div className="steps-list">
      <div className="steps">
          {list}
    </div>
  </div>
  )
}
