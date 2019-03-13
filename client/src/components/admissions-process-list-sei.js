import React from 'react';

import checkMark from '../assets/images/icon-checkmark-orange.png';


export default (props) => {
  let list = props.steps.map((step, i) => {
    if (!props.opp.currentStep || step.status.includes('Enroll') || step.status.includes('Hold')) return null;
    if (props.opp.currentStep.step > step.step) {
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
