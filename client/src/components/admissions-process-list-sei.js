import React from 'react';

import checkMark from '../assets/images/icon-checkmark-orange.png';
import NextStepBlock from './next-steps-block';


export default (props) => {
  let activeStep = props.steps.find(el => el.step === props.opp.currentStep.step);

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
    <div>
      <div className="table-row -steps">
        <div className="steps-list">
          <div className="steps">
              {list}
            </div>
        </div>
    </div>
    <NextStepBlock opp={props.opp} step={activeStep}/>
  </div>
  )
}
