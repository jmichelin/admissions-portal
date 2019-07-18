import { CAMPUSES, CAMPUSES_SEI_18WK } from '../../../constants';
import moment from 'moment';

const CAMPUS_FETCH_URL = '/api/v1/campuses';

const getOfferings = async (campus, courseType, courseProduct) => {
  if (!campus || !courseType || !courseProduct) return [];
  let offerings = await fetch(`${CAMPUS_FETCH_URL}/${encodeURI(campus)}`, {
    headers: { Authorization: `Bearer ${localStorage.token}`}
  })
    .then(res => res.json())
    .then(result => {
      return result.filter(c => {
        //normalize Full Stack from Leads for Web Development as Course Product on Courses
        if (courseProduct === 'Full Stack') courseProduct = 'Web Development';
        // if 18wk campus return only 18wk courses otherwise return 12wk courses
          if (courseProduct === 'Web Development' && CAMPUSES_SEI_18WK.includes(campus)) {
            return c.courseType === '18 Week Full-Time Immersive' && c.courseProduct === courseProduct && Date.parse(c.startDate) > Date.now()
          } else if (courseProduct === 'Web Development' && campus === 'Remote') {
            return ((c.courseType === '12 Week Full-Time Immersive' || c.courseType === '36 Week Part-Time Immersive') && c.courseProduct === courseProduct && Date.parse(c.startDate) > Date.now())
          } else {
            return c.courseType === courseType && c.courseProduct === courseProduct && Date.parse(c.startDate) > Date.now()
          }
      }).map((offering) => {
        return { value: offering.courseName, name: `${moment(offering.startDate).format('MMM DD, YYYY')} ${offering.courseType === `36 Week Part-Time Immersive` ? '(Part-Time)' : ''}` };
      });
    });
  return offerings;
};

export const APPLICATION_INPUTS = [
  {
    name: 'Software Engineering Immersive',
    courseProduct: 'Full Stack',
    courseType: '12 Week Full-Time Immersive',
    formFields: [
      {
        id: 'campus',
        label: 'Where are you planning to take this course?',
        type: 'select',
        fieldName: 'Campus__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select a valid campus",
        options: CAMPUSES
      }, {
        id: 'course-dates',
        label: 'When would you like to take this course?',
        fieldName: 'Which_dates_you_prefer_to_take_course__c',
        type: 'select',
        options: [],
        validate: ["string"],
        errorMsg: "Please select a preferred date",
        value: '',
        dependentField: "Campus__c",
        dependentProcess: getOfferings,
        saveOnChange: true
      }, {
        placeholder: 'MM/DD/YYYY',
        id: 'date-of-birth',
        label: 'Date of Birth',
        fieldName: 'Birthdate__c',
        errorMessage: 'Invalid birthday. Must be formatted as MM/DD/YYYY.',
        type: 'text',
        value: '',
        validate: ["birthday"],
        errorMsg: "Please use a proper MM/DD/YYYY format.",
        cleave: true
      }, {
        id: 'is-international',
        label: 'Are you a U.S. Citizen or permanent resident?',
        type: 'select',
        fieldName: 'International__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select an option",
        options: [
          {
            name: 'Yes',
            value: 'false'
          },
          {
            name: 'No',
            value: 'true'
          }
        ]
      }, {
        id: 'why-applying',
        label: 'Why are you applying to this Galvanize Program?',
        fieldName: 'Reason_applying_to_this_gSchool_Program__c',
        type: 'textarea',
        validate: ["250-1500-chars"],
        errorMsg: "Must have between 250 to 1500 characters",
        value: ''
      }, {
        id: 'of-age',
        label: `I am at least 18 years old and I have at least a HS diploma or equivalent. I understand I will be asked to provide proof of my prior educational history if I enroll.`,
        fieldName: 'Is_Eighteen',
        type: 'checkbox',
        value: '',
        validate: ['checked'],
        errorMsg: 'You must agree to being 18 or older',
        sfIgnore: true
      },
    ]
  },
  {
    name: 'Data Science Immersive',
    courseProduct: 'Data Science',
    courseType: '13 Week Full-Time Immersive',
    formFields : [
      {
        id: 'campus',
        label: 'Where are you planning to take this course?',
        type: 'select',
        fieldName: 'Campus__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select a valid campus",
        options: CAMPUSES
      }, {
        id: 'course-dates',
        label: 'When would you like to take this course?',
        fieldName: 'Which_dates_you_prefer_to_take_course__c',
        type: 'select',
        options: [],
        validate: ["string"],
        errorMsg: "Please select a preferred date",
        value: '',
        dependentField: "Campus__c",
        dependentProcess: getOfferings,
        saveOnChange: true
      }, {
        placeholder: 'MM/DD/YYYY',
        id: 'date-of-birth',
        label: 'Date of Birth',
        fieldName: 'Birthdate__c',
        errorMessage: 'Invalid birthday. Must be formatted as MM/DD/YYYY.',
        type: 'text',
        value: '',
        validate: ["birthday"],
        errorMsg: "Please use a proper MM/DD/YYYY format.",
        cleave: true
      }, {
        id: 'is-international',
        label: 'Are you a U.S. Citizen or permanent resident?',
        type: 'select',
        fieldName: 'International__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select an option",
        options: [
          {
            name: 'Yes',
            value: 'false'
          },
          {
            name: 'No',
            value: 'true'
          }
        ]
      }, {
        id: 'why-applying',
        label: 'Why are you applying to this Galvanize Program?',
        fieldName: 'Reason_applying_to_this_gSchool_Program__c',
        type: 'textarea',
        validate: ["250-1500-chars"],
        errorMsg: "Must have between 250 to 1500 characters",
        value: ''
      }, {
        id: 'of-age',
        label: `I am at least 18 years old and I have at least a HS diploma or equivalent. I understand I will be asked to provide proof of my prior educational history if I enroll.`,
        fieldName: 'Is_Eighteen',
        type: 'checkbox',
        value: '',
        validate: ['checked'],
        errorMsg: 'You must agree to being 18 or older',
        sfIgnore: true
      },
    ]
  }
]
