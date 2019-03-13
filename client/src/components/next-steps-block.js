import React from 'react';
import { Link } from 'react-router-dom';


import NextStepsCodingChallenge from './next-steps-coding-challenge';
import NextStepsBookInterview from './next-steps-book-interview';
import NextStepsInterviewScheduled from './next-steps-interview-scheduled';
import NextStepsPassedInterview from './next-steps-passed-interview';
import NextStepsHold from './next-steps-hold';

import { SEI_STEPS_12_WK } from '../constants';


export default (props) => {

function getSEINextSteps() {
  if(!props.currentStep ) return <NextStepsHold {...props}/>
  switch(props.currentStep.status) {
    case SEI_STEPS_12_WK.STEP_TWO.status:
    return <NextStepsCodingChallenge {...props}/>
    case SEI_STEPS_12_WK.STEP_THREE.status:
    return <NextStepsBookInterview {...props}/>
    case SEI_STEPS_12_WK.STEP_FOUR.status:
    return <NextStepsInterviewScheduled {...props}/>
    case SEI_STEPS_12_WK.COMPLETE.status:
    return <NextStepsPassedInterview {...props}/>
    case SEI_STEPS_12_WK.HOLD.status:
    return <NextStepsHold {...props}/>
    default:
    return <NextStepsHold {...props}/>
    }
  }

  function getDSINextSteps() {
    if(!props.currentStep ) return <NextStepsHold {...props}/>
    switch(props.currentStep.status) {
      case 'Awaiting Coding Challenge':
      return <NextStepsHold {...props}/>
      case 'Schedule Your Interview':
      return <NextStepsHold {...props}/>
      case 'Interview Passed':
      return <NextStepsHold {...props}/>
      case 'On Hold':
      return <NextStepsHold {...props}/>
      case 'Contact Your EO':
      return <NextStepsHold {...props}/>
      default:
      return <NextStepsHold {...props}/>
      }
    }

  return (
    <div className={props.step.blockClass ? `next-steps ${props.step.blockClass}` : "next-steps"}>
      <div className="left-text">
        <h4>Next Steps</h4>
        <p className="-inverse">{props.step.description}</p>
        {props.alertText ? <p className="-alert -inverse">{props.step.alertText}</p> : null}
      </div>
      { props.step.buttonPath ? <Link to={{
            pathname: `${props.step.buttonPath}`,
            state: { opp: props.opp},
            override: props.step.override }}>
            <button className="button-primary">{props.step.buttonText}</button></Link> : null}
      </div>
  )
}
