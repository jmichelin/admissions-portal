import React from 'react';

import NextStepsCodingChallenge from './next-steps-coding-challenge';
import NextStepsBookInterview from './next-steps-book-interview';
import NextStepsInterviewScheduled from './next-steps-interview-scheduled';
import NextStepsPassedInterview from './next-steps-passed-interview';
import NextStepsHold from './next-steps-hold';

import { SEI_STEPS } from '../constants';


export default (props) => {

function getSEINextSteps() {
  switch(props.currentStep.status) {
    case SEI_STEPS.STEP_TWO.status:
    return <NextStepsCodingChallenge {...props}/>
    case SEI_STEPS.STEP_THREE.status:
    return <NextStepsBookInterview {...props}/>
    case SEI_STEPS.STEP_FOUR.status:
    return <NextStepsInterviewScheduled {...props}/>
    case SEI_STEPS.COMPLETE.status:
    return <NextStepsPassedInterview {...props}/>
    case SEI_STEPS.HOLD.status:
    return <NextStepsHold {...props}/>
    default:
    return <NextStepsHold {...props}/>
    }
  }

  function getDSINextSteps() {
    switch(props.currentStep.status) {
      case 'Awaiting Coding Challenge':
      return <NextStepsCodingChallenge {...props}/>
      case 'Schedule Your Interview':
      return <NextStepsBookInterview {...props}/>
      case 'Interview Passed':
      return <NextStepsCodingChallenge {...props}/>
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
