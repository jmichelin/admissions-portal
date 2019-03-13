  import { SEI_STEPS_12_WK, SEI_STEPS_18_WK } from '../constants';

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
    if (!opp.scorecard) {
      return SEI_STEPS_12_WK.HOLD;
    } else if (opp.courseProduct === 'Web Development') {
      if (opp.courseType === '18 Week Full-Time Immersive') {
        return getSEI18WkStage(opp);
      } else if (opp.courseType === 'Specialty Immersive') {
        return getSEI12WkStage(opp);
      } else {
        return getSEI12WkStage(opp);
      }
    } else if (opp.courseProduct === 'Data Science') {
        return getDSIStage(opp);
    } else {
      return SEI_STEPS_12_WK.HOLD;
    }
  }

  function getSEI12WkStage(opp) {
    if (opp.scorecard.moveForwardCode !== 'Yes') {
      //person needs to do coding challenge
      return SEI_STEPS_12_WK.STEP_TWO;
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview !== 'No' && opp.scorecard.moveForwardInterview !== 'Yes' && opp.stage !== 'Interview 1 Scheduled') {
      //passed coding challenge but person needs to book the interview
      return SEI_STEPS_12_WK.STEP_THREE;
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.stage === 'Interview 1 Scheduled') {
      //passed coding challenge and booked interview
      return SEI_STEPS_12_WK.STEP_FOUR;
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'No') {
      //passed coding challenge and booked interview but failed
      return SEI_STEPS_12_WK.HOLD;
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'Yes') {
      //passed coding challenge and booked interview and passed
      return SEI_STEPS_12_WK.COMPLETE;
    } else {
      // catch all case - talk to your EO for next steps
      return SEI_STEPS_12_WK.HOLD;
    }
  }

  function getSEI18WkStage(opp) {
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
      return {index: 0, status: 'Contact Your EO'};
    }
    if (!opp.scorecard.finalCode && !opp.scorecard.moveForwardCode) {
      //person needs to do coding challenge
      return {index: 1, status: 'Awaiting Coding Challenge'};
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview !== 'No' && opp.scorecard.moveForwardInterview !== 'Yes') {
      //passed coding challenge but person needs to book the interview
      return {index: 2, status: 'Schedule Your Interview'};
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'No') {
      //passed coding challenge and booked interview but failed
      return {index: 2, status: 'On Hold'};
    } else if (opp.scorecard.finalCode && opp.scorecard.moveForwardCode === 'Yes' && opp.scorecard.moveForwardInterview === 'Yes') {
      //passed coding challenge and booked interview and passed
      return {index: 3, status: 'Interview Passed'};
    } else {
      // catch all case - talk to your EO for next steps
      return {index: 1, status: 'Contact Your EO'};
    }
  }
export default {
  getCourseName,
  getStage,
  getDSIStage
};
