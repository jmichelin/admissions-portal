function getCreateAccountInputs() {
  return [{
    id: 'first_name',
    label: 'First Name',
    type: 'text',
    value: '',
    required: true,
    errorMessage: 'This field is required.'
    },
    {
    id: 'last_name',
    label: 'Last Name',
    type: 'text',
    value: '',
    required: true,
    errorMessage: 'This field is required.'
   },
   {
    id: 'email',
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    errorMessage: 'Enter a valid email.'
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    fieldName: 'Password',
    value: '',
    required: true,
    errorMessage: 'Password must be between 5 and 15 characters.'
  },
  {
    id: 'confirmed_password',
    label: 'Confirm Password',
    type: 'password',
    fieldName: 'Confirm Password',
    value: '',
    required: true,
    errorMessage: 'Passwords must match.'
  },
  {
    id: 'terms',
    label: `I agree to Galvanize's Privacy Policy and Terms of Use.`,
    fieldName: 'Privacy_Policy_Date__c',
    type: 'checkbox',
    value: '',
    required: true,
    errorMessage: 'This is a required field.'
  }];
}

export default {
  getCreateAccountInputs: getCreateAccountInputs
};
