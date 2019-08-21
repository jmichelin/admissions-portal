import {
  SEI_STEPS_12_WK,
  SEI_STEPS_18_WK,
  DSI_STEPS,
  LEAD_SOURCE_COOKIE
} from '../constants';

function getCourseName(opp) {
  const campus = opp.campus;

  if (opp.courseProduct === 'Web Development' && opp.courseType.includes('Immersive')) {
    if (opp.productCode && opp.productCode.includes('-WD-')) {
      if (opp.productCode && opp.productCode.includes('-WD-REM')) {
        return {
          course: 'Remote Software Engineering Immersive',
          campus: 'Remote'
        };
      }
      if (opp.productCode && opp.productCode.includes('-WD-RPT')) {
        return {
          course: 'Part-Time Remote Software Engineering Immersive',
          campus: "Remote"
        };
      } else {
        return {
          course: 'Software Engineering Immersive',
          campus: campus
        };
      }
    } else {
      return {
        course: 'Specialty Immersive',
        campus: campus
      };
    }
  } else if (opp.productCode && opp.productCode.includes('-DS-') && opp.courseType.includes('Immersive')) {
    return {
      course: 'Data Science Immersive',
      campus: campus
    };
  } else {
    return {
      course: 'Specialty Immersive',
      campus: campus
    };
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
    return SEI_STEPS_18_WK.STEP_ONE
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
    return DSI_STEPS.STEP_ONE
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
  'Web Development': {
    '18 Week Full-Time Immersive': {
      name: 'Software Engineering Immersive',
      step: getSEI18WkStage,
      process: SEI_STEPS_18_WK,
    },
    '36 Week Part-Time Immersive': {
      name: 'Part-Time Software Engineering Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    },
    'Specialty Immersive': {
      name: 'Specialty Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    },
    '12 Week Full-Time Immersive': {
      name: 'Software Engineering Immersive',
      step: getSEI12WkStage,
      process: SEI_STEPS_12_WK
    }
  },
  'Data Science': {
    '13 Week Full-Time Immersive': {
      name: 'Data Science Immersive',
      step: getDSIStage,
      process: DSI_STEPS
    }
  },
  'Default': {
    name: 'Software Engineering Immersive',
    step: getSEI12WkStage,
    process: SEI_STEPS_12_WK
  }
};

// TODO: This needs to be refactored - it never will resolve to default
// but instead will break because of the course prod and course type ternarys
// can refactor this to use the AVAILABLE_PROGRAMS constant in constants file
function getStage(program) {
  if(program.course_product === 'Full Stack') program.course_product = 'Web Development';
  let courseProducts = program.courseProduct ? PROGRAMS[program.courseProduct] : PROGRAMS[program.course_product];
  if (!courseProducts) {

    let stage = PROGRAMS['Default'];
    return {
      step: stage.step(program),
      process: stage.process,
      name: stage.name
    };
  }

  let courseType = program.courseType ? PROGRAMS[program.courseProduct][program.courseType] : PROGRAMS[program.course_product][program.course_type];
  if (!courseType) {

    courseType = PROGRAMS[program.courseProduct]['Default'];
    return {
      step: courseType.step(program),
      process: courseType.process,
      name: courseType.name
    }
  };
  return {
    step: courseType.step(program),
    process: courseType.process,
    name: courseType.name
  }
};

function lookForCookie(cookies, cname) {
  let cookiesArr = cookies.split(';')
  for (var i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i].includes(cname)) return cookiesArr[i].split('=')[1];
  }
  return null;
}

function getParameterByName(name, queryString) {
  let query = queryString.toString();
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  let regexS = "[\\?&]" + name + "=([^&#]*)";
  let regex = new RegExp(regexS);
  let results = regex.exec(query);
  if (results == null) return '';
  else return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getLeadSource(cookie, queryString) {
  let leadSource = {};

  if (document && lookForCookie(cookie, LEAD_SOURCE_COOKIE)) {
    let currentCookie = JSON.parse(lookForCookie(cookie, LEAD_SOURCE_COOKIE));
    leadSource.LeadSource = currentCookie.source || "Galvanize.com";
    leadSource.LeadSourceDetail__c = currentCookie.utm_source || "Direct";
    leadSource.pi__utm_source__c = currentCookie.utm_source;
    leadSource.pi__utm_medium__c = currentCookie.utm_medium;
    leadSource.pi__utm_campaign__c = currentCookie.utm_campaign;
    return leadSource;
  } else if (getParameterByName('src', queryString) === "hackreactor") {
    leadSource.LeadSource = 'HackReactor.com';
    leadSource.LeadSourceDetail__c = 'Direct';
    return leadSource;
  } else {
    leadSource.LeadSource = 'Galvanize.com';
    leadSource.LeadSourceDetail__c = 'Direct';
    return leadSource;
  }
}

function conversionQuery(product) {
  if(product === 'Full Stack' || product === 'Web Development') return 'sei';
  if(product === 'Data Science') return 'dsi';
  return 'all';
}

export default {
  getSEI12WkStage,
  getSEI18WkStage,
  getDSIStage,
  getStage,
  getCourseName,
  lookForCookie,
  getParameterByName,
  getLeadSource,
  conversionQuery
};
