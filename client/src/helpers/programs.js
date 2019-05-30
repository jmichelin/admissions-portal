import { getSEI12WkStage, getSEI18WkStage, getDSIStage } from './utils';
import { SEI_STEPS_18_WK, SEI_STEPS_12_WK, DSI_STEPS } from '../constants';

const PROGRAMS = {
  'Web Development' : {
    '18 Week Full-Time Immersive' : {
      step: getSEI18WkStage,
      process: SEI_STEPS_18_WK
    },
    'Default': {
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    }
  },
  'Data Science' : {
    'Default' : {
      step: getDSIStage,
      process: DSI_STEPS
    }
  },
  'Default' : {
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
  }
};

function getStage(opp) {
  let courseProducts = PROGRAMS[opp.courseProduct];

  if (!courseProducts) {
    let stage = PROGRAMS['Default'];
    return { step: stage.step(opp), process: stage.process };
  }

  let courseType = PROGRAMS[opp.courseProduct][opp.courseType];
  if (!courseType) {
    courseType = PROGRAMS[opp.courseProduct]['Default'];
    return { step: courseType.step(opp), process: courseType.process }
  };
  return { step: courseType.step(opp), process: courseType.process }
};

export default {
  getStage
};
