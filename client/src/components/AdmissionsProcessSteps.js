import React from 'react';
import checkMark from '../assets/images/icon-checkmark-orange.png';

export default (props) => {
  if (!props.admissionsProcess) return null;

  return (
    <div className="admissions-steps">
      <div className="table-row -steps">
        <div className="steps-list">
          <div className="steps">
            {Object.keys(props.admissionsProcess).map((steppy, i) => {
              const step = props.admissionsProcess[steppy];

              if (step.status.includes('Enroll') || step.status.includes('Hold') || step.hidden) return null;

              if (props.admissionsProcess.currentStep &&  props.admissionsProcess.currentStep.step > step.step) {
                return (
                  <div className="step" key={i}>
                    <span className="number -complete"><img alt=""src={checkMark}></img></span>
                    <span className="label">{step.status}</span>
                  </div>
                )
              } else if (props.admissionsProcess.currentStep === step.step) {
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
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
