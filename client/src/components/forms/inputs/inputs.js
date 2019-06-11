import { CAMPUSES } from '../../../constants';
import { APPLICATION_INPUTS } from './application-inputs';

// TODO Murph where's the source of truth on these?
const CAMPUS_OFFERINGS = {
  "Austin-2nd St District": [{name: 'Software Engineering Immersive'}],
  "Boulder-Walnut St.": [{name: 'Software Engineering Immersive'}],
  "Denver-Platte": [{name:'Software Engineering Immersive'}, {name: 'Data Science Immersive'}],
  "NYC-SoHo": [{name:'Software Engineering Immersive'}, {name: 'Data Science Immersive'}],
  "Phoenix-Warehouse District": [{name: 'Software Engineering Immersive'}],
  "Los Angeles": [{name: 'Software Engineering Immersive'}],
  "San Francisco-SoMa": [{name:'Software Engineering Immersive'}, {name: 'Data Science Immersive'}],
  "Seattle-Pioneer Square": [{name:'Software Engineering Immersive'}, {name: 'Data Science Immersive'}],
  "Remote": [{name: 'Software Engineering Immersive'}]
}

const getPrograms = (campus) => {
  return Promise.resolve(CAMPUS_OFFERINGS[campus])
}

function getCreateAccountInputs() {
  return [
    {
      id: 'first_name',
      fieldName: 'first_name',
      label: 'First Name',
      type: 'text',
      value: '',
      required: true,
      errorMessage: 'This field is required.'
    },
    {
      id: 'last_name',
      fieldName: 'last_name',
      label: 'Last Name',
      type: 'text',
      value: '',
      required: true,
      errorMessage: 'This field is required.'
    },
    {
      id: 'email',
      fieldName: 'email',
      label: 'Email',
      type: 'email',
      value: '',
      required: true,
      errorMessage: 'Enter a valid email.'
    },
    {
      id: 'phone',
      fieldName: 'phone',
      label: 'Phone',
      type: 'tel',
      value: '',
      required: true,
      errorMessage: 'Enter a valid phone number.'
    },
    {
      id: 'campus',
      fieldName: 'campus',
      label: 'Preferred Campus',
      type: 'select',
      value: '',
      options: CAMPUSES,
      errorMessage: "Select a campus."
    },
    {
      id: 'program',
      fieldName: 'program',
      label: 'Preferred Program',
      type: 'select',
      value: '',
      options: APPLICATION_INPUTS,
      errorMessage: 'Select a program.',
      dependentField: "campus",
      dependentProcess: getPrograms,
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      fieldName: 'password',
      value: '',
      required: true,
      errorMessage: 'Password must be between 5 and 15 characters.'
    },
    {
      id: 'confirmed_password',
      label: 'Confirm Password',
      type: 'password',
      fieldName: 'confirmed_password',
      value: '',
      required: true,
      errorMessage: 'Passwords must match.'
    },
    {
      id: 'terms',
      label: `I agree to Galvanize's Privacy Policy and Terms of Use.`,
      fieldName: 'terms',
      type: 'checkbox',
      value: '',
      required: true,
      errorMessage: 'This is a required field.'
    }
  ];
}

function getSignInInputs() {
  return [
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
      errorMessage: 'Please enter a valid password.'
    }
  ];
}

function getForgotPasswordInputs() {
  return [{
    id: 'email',
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    errorMessage: 'Enter a valid email.'
  }];
}

function resetPasswordInputs() {
  return [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      value: '',
      required: true,
      errorMessage: 'Cannot change email on password reset.'
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
    }
  ];
}

export default {
  getCreateAccountInputs,
  getSignInInputs,
  getForgotPasswordInputs,
  resetPasswordInputs,
};
