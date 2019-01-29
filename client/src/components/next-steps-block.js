import React from 'react';
import { Link } from 'react-router-dom';

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
      break;
    case SEI_STEPS.STEP_THREE.status:
    return <NextStepsBookInterview {...props}/>
      break;
    case SEI_STEPS.STEP_FOUR.status:
    return <NextStepsInterviewScheduled {...props}/>
      break;
    case SEI_STEPS.COMPLETE.status:
    return <NextStepsPassedInterview {...props}/>
      break;
    case SEI_STEPS.STEP_HOLD.status:
    return <NextStepsHold {...props}/>
      break;
    default:
    return null;
    }
  }

  function getDSINextSteps() {
    switch(props.stage.status) {
      case 'Awaiting Coding Challenge':
      return <NextStepsCodingChallenge {...props}/>
        break;
      case 'Schedule Your Interview':
      return <NextStepsBookInterview {...props}/>
        break;
      case 'Interview Passed':
      return <NextStepsCodingChallenge {...props}/>
        break;
      case 'On Hold':
      return <NextStepsHold {...props}/>
        break;
        case 'Contact Your EO':
        return <NextStepsHold {...props}/>
          break;
      default:
      return null;
      }
    }

  return (
    props.opp.courseProduct === 'Web Development' ? getSEINextSteps() : getDSINextSteps()
  )
}
