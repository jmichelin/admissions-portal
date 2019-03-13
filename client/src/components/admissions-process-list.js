import React from 'react';

import AdmissionsProcessSteps from './admissions-process-steps';

import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import { APPLICATION_STEPS_DSI, APPLICATION_STEPS_SEI_12WK, APPLICATION_STEPS_SEI_18WK } from '../constants';


function renderProgramAdmissionsSteps(opp) {
  switch(opp.courseType + '&&' +  opp.courseProduct) {
    case '18 Week Full-Time Immersive' && 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_18WK}/>
    case 'Specialty Immersive' && 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
    case '12 Week Full-Time Immersive' && 'Web Development':
    return <AdmissionsProcessSteps opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
      case '13 Week Full-Time Immersive' && 'Data Science':
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
