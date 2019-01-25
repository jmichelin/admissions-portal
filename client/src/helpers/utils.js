  function getCourseName(opp) {
    let campus = opp.campus;
    if (opp.courseProduct === 'Web Development' && opp.courseType.includes('Immersive')) {
      if (opp.productCode && opp.productCode.includes('-WD-')) {
        if (opp.productCode && opp.productCode.includes('-WD-REM')) {
          return {course: 'Software Engineering Remote Immersive', campus : 'Remote'};
        }
        if (opp.productCode && opp.productCode.includes('-WD-RPT')) {
            return {course: 'Software Engineering Remote Part-Time Immersive', campus : "Remote"};
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
  getStage
};
