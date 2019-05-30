import { SEI_STEPS_12_WK, SEI_STEPS_18_WK, DSI_STEPS } from '../constants';

 function getCourseName(opp) {
  let campus = opp.campus;
  if (opp.courseProduct === 'Web Development' && opp.courseType.includes('Immersive')) {
    if (opp.productCode && opp.productCode.includes('-WD-')) {
      if (opp.productCode && opp.productCode.includes('-WD-REM')) {
        return {course: 'Remote Software Engineering Immersive', campus : 'Remote'};
      }
      if (opp.productCode && opp.productCode.includes('-WD-RPT')) {
          return {course: 'Part-Time Remote Software Engineering Immersive', campus : "Remote"};
      } else {
        return {course: 'Software Engineering Immersive', campus : campus};
      }
    } else {
      return {course: 'Specialty Immersive', campus: campus};
    }
  } else if (opp.productCode && opp.productCode.includes('-DS-')  && opp.courseType.includes('Immersive')) {
    return {course: 'Data Science Immersive', campus : campus};
  } else {
    return {course: 'Specialty Immersive', campus: campus};
  }
}

 function getSEI12WkStage(opp) {
  if (!opp.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  }
    else if (opp.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return SEI_STEPS_12_WK.STEP_TWO;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview !== 'No' && opp.scorecard.moveForwardInterview !== 'Yes' && opp.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return SEI_STEPS_12_WK.STEP_THREE;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return SEI_STEPS_12_WK.STEP_FOUR;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return SEI_STEPS_12_WK.HOLD;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return SEI_STEPS_12_WK.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return SEI_STEPS_12_WK.HOLD;
  }
}

 function getSEI18WkStage(opp) {
  if (!opp.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  }
  if (opp.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return SEI_STEPS_18_WK.STEP_FOUR;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview !== 'No' && opp.scorecard.moveForwardInterview !== 'Yes' && opp.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return SEI_STEPS_18_WK.STEP_TWO;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return SEI_STEPS_18_WK.STEP_THREE;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return SEI_STEPS_18_WK.HOLD;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return SEI_STEPS_18_WK.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return SEI_STEPS_18_WK.HOLD;
  }
}

 function getDSIStage(opp) {
  if (!opp.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  }
  if (opp.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return DSI_STEPS.STEP_TWO;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview !== 'No' && opp.scorecard.moveForwardInterview !== 'Yes' && opp.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return DSI_STEPS.STEP_THREE;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return DSI_STEPS.STEP_FOUR;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return DSI_STEPS.HOLD;
  } else if (opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return DSI_STEPS.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return DSI_STEPS.HOLD;
  }
}

const PROGRAMS = {
  'Web Development' : {
    '18 Week Full-Time Immersive' : {
      name: 'Extended Software Engineering Immersive',
      step: getSEI18WkStage,
      process: SEI_STEPS_18_WK,
    },
    '36 Week Full-Time Immersive' : {
      name: 'Part-Time Software Engineering Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    },
    'Specialty Immerisve' : {
      name: 'Specialty Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    },
    'Default': {
      name: 'Software Engineering Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    }
  },
  'Data Science' : {
    'Default' : {
      name: 'Data Science Immersive',
      step: getDSIStage,
      process: DSI_STEPS
    }
  },
  'Default' : {
      name: 'Software Engineering Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
  }
};

function getStage(opp) {
  let courseProducts = PROGRAMS[opp.courseProduct];

  if (!courseProducts) {
    let stage = PROGRAMS['Default'];
    return { step: stage.step(opp), process: stage.process, name: stage.name };
  }

  let courseType = PROGRAMS[opp.courseProduct][opp.courseType];
  if (!courseType) {
    courseType = PROGRAMS[opp.courseProduct]['Default'];
    return { step: courseType.step(opp), process: courseType.process, name: courseType.name }
  };
  return { step: courseType.step(opp), process: courseType.process, name: courseType.name }
};

export default {
  getSEI12WkStage,
  getSEI18WkStage,
  getDSIStage,
  getStage,
  getCourseName
};
