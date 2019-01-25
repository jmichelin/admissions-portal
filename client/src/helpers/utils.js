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

export default {
  getCourseName
};
