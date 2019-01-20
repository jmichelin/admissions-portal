function getProcessInputs(program) {
  if (program === 'Data Science') {
    return [{
      label: 'Complete the Application Form',
      stage: 'New'
    },
    {
      label: 'Schedule the Technical Interview',
      stage: 'Returned Takehome'
    },
    {
      label: 'Decision',
      stage: 'Offer Out'
      }];
  } else {
    return [{
      label: 'Complete the Application Form',
      stage: 'New'
    },
    {
      label: 'Pass the Coding Challenge',
      stage: 'Sent Takehome'
    },
    {
      label: 'Schedule the Technical Interview',
      stage: 'Returned Takehome'
    },
    {
      label: 'Decision',
      stage: 'Offer Out'
      }];
  }
}

export default {
  getProcessInputs: getProcessInputs,
};
