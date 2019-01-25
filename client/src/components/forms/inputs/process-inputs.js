function getProcessInputs(program) {
  if (program === 'Data Science') {
    return [{
      label: 'Complete the Application Form',
      stage: 0
    },
    {
      label: 'Schedule the Technical Interview',
      stage: 1
    },
    {
      label: 'Decision',
      stage: 2
      }];
  } else {
    return [{
      label: 'Complete the Application Form',
      stage: 0
    },
    {
      label: 'Pass the Coding Challenge',
      stage: 1
    },
    {
      label: 'Schedule the Technical Interview',
      stage: 2
    },
    {
      label: 'Pass the Technical Interview',
      stage: 3
      }];
  }
}

export default {
  getProcessInputs: getProcessInputs,
};
