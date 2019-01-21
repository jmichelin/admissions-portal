import React from 'react';

import checkMark from '../assets/images/icon-checkmark-orange.png';
import steps from './forms/inputs/process-inputs';

export default (props) => {

  let enableCodingChallenge = false;

  if (props.opp.StageName === 'New') {
    enableCodingChallenge = true;
  }

  let inputs  = steps.getProcessInputs(props.program);
  let list = inputs.map((input, i) => {
    if (props.opp.StageName === input.stage) {
      return (
        <div className="step" key={i}>
          <span className="number -complete"><img src={checkMark}></img></span>
          <span className="label">{input.label}</span>
        </div>
      )
    }
    return (
      <div className="step" key={i}>
        <span className="number">{i+1}</span>
        <span className="label">{input.label}</span>
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
