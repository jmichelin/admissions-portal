import React from 'react';

import NextStepsCodingChallenge from './next-steps-coding-challenge';
import NextStepsBookInterview from './next-steps-book-interview';
import NextStepsInterviewScheduled from './next-steps-interview-scheduled';
import NextStepsPassedInterview from './next-steps-passed-interview';
import NextStepsHold from './next-steps-hold';

import { SEI_STEPS_12_WK } from '../constants';


export default (props) => {

function getSEINextSteps() {
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
    props.opp.courseProduct === 'Web Development' ? getSEINextSteps() : getDSINextSteps()
  )
}
