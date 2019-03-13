import React from 'react';

import AdmissionsProcessListSEI from './admissions-process-list-sei';
import AdmissionsProcessListDSI from './admissions-process-list-dsi';

import NextStepBlock from './next-steps-block';
import ResourcesSEI from './resources-sei';
import ResourcesDSI from './resources-dsi';

import { DSI_STEPS, APPLICATION_STEPS_DSI, SEI_STEPS_12_WK, APPLICATION_STEPS_SEI_12WK, APPLICATION_STEPS_SEI_18WK } from '../constants';


function renderProgramAdmissionsSteps(opp) {
  switch(opp.courseType) {
    case '18 Week Full-Time Immersive':
    return <AdmissionsProcessListSEI opp={opp} steps={APPLICATION_STEPS_SEI_18WK}/>
    case 'Specialty Immersive':
    return <AdmissionsProcessListSEI opp={opp} steps={APPLICATION_STEPS_SEI_18WK}/>
    default:
    return <AdmissionsProcessListSEI opp={opp} steps={APPLICATION_STEPS_SEI_12WK}/>
    }
}


export default (props) => {

  return (
    <div>
      <div className="table-row -steps">
      { renderProgramAdmissionsSteps(props.opp) }
      </div>
      <NextStepBlock currentStep={props.opp.currentStep} opp={props.opp}/>
      {props.opp.courseProduct === 'Web Development' ? <ResourcesSEI/> : <ResourcesDSI/>}
    </div>
  )
}
