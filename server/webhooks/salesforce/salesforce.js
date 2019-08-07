const express = require('express');

const router = express.Router();
const Q = require('../../db/queries');

router.post("/", (req, _res, _next) => {
  let sfCampusesWithOfferrings = req.body;

  sfCampusesWithOfferrings.forEach( campus => {
    if (campus.campus != null) {
      return Q.getCampus(campus.campus).then((foundCampus)=>{
        campus.courses = reformatData(campus.courses)
        if (foundCampus !== undefined) {
          return Q.updateCampus(campus);
        } else {
          return Q.createCampus(campus);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  });
});

function reformatData(ogData) {
  let courses = [];
  let courseTemplate = {};

  ogData.forEach( course => {
    let cleanCourse = {}
    console.log(course);
    cleanCourse.startDate = course['startDate'];
    cleanCourse.courseProduct = course['courseProduct'];
    cleanCourse.courseId = course['courseId'];
    cleanCourse.campus = course['campus'];
    cleanCourse.cohortCode = course['cohortCode'];
    cleanCourse.courseName = course['courseName'];
    cleanCourse.courseType = course['courseType'];

    courses.push(cleanCourse);
  })

  return courses;
}

module.exports = router;
