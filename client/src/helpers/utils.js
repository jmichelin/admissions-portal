import { SEI_STEPS_12_WK, SEI_STEPS_18_WK, DSI_STEPS } from '../constants';

function getCourseName(opp) {
  const campus = opp.campus;

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

function getSEI12WkStage(program) {
  if (program.type === 'application') {
    return SEI_STEPS_12_WK.STEP_ONE
  } else if (!program.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  } else if (program.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return SEI_STEPS_12_WK.STEP_TWO;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview !== 'No' && program.scorecard.moveForwardInterview !== 'Yes' && program.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return SEI_STEPS_12_WK.STEP_THREE;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return SEI_STEPS_12_WK.STEP_FOUR;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return SEI_STEPS_12_WK.HOLD;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return SEI_STEPS_12_WK.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return SEI_STEPS_12_WK.HOLD;
  }
}

function getSEI18WkStage(program) {
  if (program.type === 'application') {
    return SEI_STEPS_12_WK.STEP_ONE
  } else if (!program.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  } else if (program.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return SEI_STEPS_18_WK.STEP_FOUR;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview !== 'No' && program.scorecard.moveForwardInterview !== 'Yes' && program.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return SEI_STEPS_18_WK.STEP_TWO;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return SEI_STEPS_18_WK.STEP_THREE;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return SEI_STEPS_18_WK.HOLD;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return SEI_STEPS_18_WK.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return SEI_STEPS_18_WK.HOLD;
  }
}

function getDSIStage(program) {
  if (program.type === 'application') {
    return SEI_STEPS_12_WK.STEP_ONE
  } else if (!program.scorecard) {
    return SEI_STEPS_12_WK.HOLD;
  } else if (program.scorecard.moveForwardCode !== 'Yes') {
    //person needs to do coding challenge
    return DSI_STEPS.STEP_TWO;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview !== 'No' && program.scorecard.moveForwardInterview !== 'Yes' && program.stage !== 'Interview 1 Scheduled') {
    //passed coding challenge but person needs to book the interview
    return DSI_STEPS.STEP_THREE;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.stage === 'Interview 1 Scheduled') {
    //passed coding challenge and booked interview
    return DSI_STEPS.STEP_FOUR;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'No') {
    //passed coding challenge and booked interview but failed
    return DSI_STEPS.HOLD;
  } else if (program.scorecard.moveForwardCode === 'Yes' && program.scorecard.moveForwardInterview === 'Yes') {
    //passed coding challenge and booked interview and passed
    return DSI_STEPS.COMPLETE;
  } else {
    // catch all case - talk to your EO for next steps
    return DSI_STEPS.HOLD;
  }
}

const PROGRAMS = {
  'Full Stack' : {
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
    'Specialty Immersive' : {
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
    '13 Week Full-Time Immersive' : {
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

// TODO: This needs to be refactored - it never will resolve to default
// but instead will break because of the course prod and course type ternarys
function getStage(program) {
  let courseProducts = program.courseProduct ? PROGRAMS[program.courseProduct] : PROGRAMS[program.course_product];
  console.log(program);
  if (!courseProducts) {
    let stage = PROGRAMS['Default'];
    return { step: stage.step(program), process: stage.process, name: stage.name };
  }

  let courseType = program.courseType ? PROGRAMS[program.courseProduct][program.courseType] : PROGRAMS[program.course_product][program.course_type];
  if (!courseType) {
    courseType = PROGRAMS[program.courseProduct]['Default'];
    return { step: courseType.step(program), process: courseType.process, name: courseType.name }
  };
  return { step: courseType.step(program), process: courseType.process, name: courseType.name }
};

export default {
  getSEI12WkStage,
  getSEI18WkStage,
  getDSIStage,
  getStage,
  getCourseName,
};
