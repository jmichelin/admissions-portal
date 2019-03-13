import React from 'react';

import AdmissionsProcessSteps from './admissions-process-steps';

import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import { APPLICATION_STEPS_DSI, APPLICATION_STEPS_SEI_12WK, APPLICATION_STEPS_SEI_18WK } from '../constants';


function renderProgramAdmissionsSteps(opp) {
  switch(true) {
    case opp.courseType === '18 Week Full-Time Immersive' && opp.courseProduct === 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_18WK}/>
      case opp.courseType === 'Specialty Immersive' && opp.courseProduct === 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
      case opp.courseType === '12 Week Full-Time Immersive' && opp.courseProduct === 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
      case opp.courseType === '13 Week Full-Time Immersive' && opp.courseProduct === 'Data Science':
      return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_DSI}/>
    default:
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
    }
}


export default (props) => {

  return (
    <div>
      { renderProgramAdmissionsSteps(props.opp) }
      {props.opp.courseProduct === 'Web Development' ? <ResourcesSEI/> : <ResourcesDSI/>}
    </div>
  )
}
