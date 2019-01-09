function getProgramInputs(programs) {
  return  {
    id: 'program',
    label: 'Program',
    type: 'select',
    value: '',
    options: programs.map(program => {
      return {
        name: program.name,
        value: program.sfdcName
      };
    })
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

export default {
  getProgramInputs: getProgramInputs,
  getCampusInputs: getCampusInputs
};
