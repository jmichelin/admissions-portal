const express = require('express');

const router = express.Router();
const Q = require('../../db/queries');

router.post("/", (req, _res, _next) => {
  let sfCourses = req.body;
 
  sfCourses.forEach( course => {
    if (course.campus != null) {
      return Q.getCoursesByCampus(course.campus).then((foundCourse)=>{
        if (foundCourse !== undefined) {
          Q.updateCourse(course) 
        } else {
          Q.createCourse(course)
        }
      }).catch(error => {});
    }
  })
})

module.exports = router;
