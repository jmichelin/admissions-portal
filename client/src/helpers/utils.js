  import { APPLICATION_STEPS_DSI, APPLICATION_STEPS_SEI_18WK, APPLICATION_STEPS_SEI_12WK, SEI_STEPS_12_WK, SEI_STEPS_18_WK, DSI_STEPS } from '../constants';

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
      }
    } else if (opp.productCode && opp.productCode.includes('-DS-')  && opp.courseType.includes('Immersive')) {
      return {course: 'Data Science Immersive', campus : campus};
    } else {
      return {};
    }
  }

  function getStage(opp) {
    if (opp.courseProduct === 'Web Development') {
      if (opp.courseType === '18 Week Full-Time Immersive') {
        return {step: getSEI18WkStage(opp), process: APPLICATION_STEPS_SEI_18WK};
      } else if (opp.courseType === 'Specialty Immersive') {
        return {step: getSEI12WkStage(opp), process: APPLICATION_STEPS_SEI_12WK};
      } else {
        return {step: getSEI12WkStage(opp), process: APPLICATION_STEPS_SEI_12WK};
      }
    } else if (opp.courseProduct === 'Data Science') {
      return {step: getDSIStage(opp), process: APPLICATION_STEPS_DSI};
    } else {
      return {step: getSEI12WkStage(opp), process: APPLICATION_STEPS_SEI_12WK};
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
export default {
  getCourseName,
  getStage,
  getDSIStage
};
