import React from 'react';

import checkMark from '../assets/images/icon-checkmark-orange.png';

import { SEI_STEPS_12_WK, APPLICATION_STEPS_SEI_12WK } from '../constants';


export default (props) => {

  let list = APPLICATION_STEPS_SEI_12WK.map((step, i) => {
    if (step.status === SEI_STEPS_12_WK.HOLD.status || step.status === SEI_STEPS_12_WK.COMPLETE.status) return null;
    if (props.currentStep.step > step.step) {
      return (
        <div className="step" key={i}>
          <span className="number -complete"><img alt=""src={checkMark}></img></span>
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
