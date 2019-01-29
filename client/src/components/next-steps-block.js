import React from 'react';
import { Link } from 'react-router-dom';

import NextStepsCodingChallenge from './next-steps-coding-challenge';
import NextStepsBookInterview from './next-steps-book-interview';
import NextStepsInterviewScheduled from './next-steps-interview-scheduled';
import NextStepsPassedInterview from './next-steps-passed-interview';
import NextStepsHold from './next-steps-hold';


export default (props) => {

function getSEINextSteps() {
  switch(props.stage.status) {
    case 'Awaiting Coding Challenge':
    return <NextStepsCodingChallenge {...props}/>
      break;
    case 'Schedule Your Interview':
    return <NextStepsBookInterview {...props}/>
      break;
    case 'Interview Scheduled':
    return <NextStepsInterviewScheduled {...props}/>
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
