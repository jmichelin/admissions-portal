function getProgramInputs(programs, applications = null) {
  let options = programs.map(program => {
    return {
      name: program.name,
      value: program.name,
      courseProduct: program.courseProduct,
      courseType: program.courseType,
    };
  })

  if (applications && applications.length > 0) {
    options = options.filter((option) => (
      !applications.find(app => (app.course_type === option.courseType && app.course_product === option.courseProduct))
    ));
  }

  return  {
    id: 'program',
    label: 'Program',
    type: 'select',
    value: '',
    options,
  };
}

function getCampusInputs(campuses) {
  return {
    id: 'campus',
    label: 'Campus',
    type: 'select',
    value: '',
    options: campuses.map(campus => {
      return {
        name: `${campus.city}`,
        value: campus.sfdcName
      };
    })
  };
}

export default { getProgramInputs, getCampusInputs };
