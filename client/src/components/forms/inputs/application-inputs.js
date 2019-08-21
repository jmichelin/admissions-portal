import {
  CAMPUSES,
  CAMPUSES_SEI_18WK
} from '../../../constants';
import moment from 'moment';

const CAMPUS_FETCH_URL = '/api/v1/campuses';

const getOfferings = async (campus, courseType, courseProduct) => {
  if (!campus || !courseType || !courseProduct) return [];
  if (campus === 'Austin-2nd Street District') campus = 'Austin-2nd St District';
  let offerings = await fetch(`${CAMPUS_FETCH_URL}/${encodeURI(campus)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    })
    .then(res => res.json())
    .then(result => {
      let validCourses = result.filter(c => {
        //normalize Full Stack from Leads for Web Development as Course Product on Courses
        if (courseProduct === 'Full Stack') courseProduct = 'Web Development';
        // if 18wk campus return only 18wk courses otherwise return 12wk courses
        if (courseProduct === 'Web Development' && CAMPUSES_SEI_18WK.includes(campus)) {
          return c.courseType === '18 Week Full-Time Immersive' && c.courseProduct === courseProduct
        } else if (courseProduct === 'Web Development' && campus === 'Remote') {
          return ((c.courseType === '12 Week Full-Time Immersive' || c.courseType === '36 Week Part-Time Immersive') && c.courseProduct === courseProduct)
        } else {
          return c.courseType === courseType && c.courseProduct === courseProduct
        }
      })
      if (!validCourses.length) {
        validCourses = fetch(`${CAMPUS_FETCH_URL}/${encodeURI('Remote')}`, {
            headers: {
              Authorization: `Bearer ${localStorage.token}`
            }
          })
          .then(res => res.json())
          .then(remCourses => {
            return remCourses.filter(remoteCourse => {
              if (courseProduct === 'Web Development' && CAMPUSES_SEI_18WK.includes(campus)) {
                return remoteCourse.courseType === '18 Week Full-Time Immersive' && remoteCourse.courseProduct === courseProduct;
              }
              return remoteCourse.courseType === courseType && remoteCourse.courseProduct === courseProduct;
            });
          });
          return validCourses;
      }
      return validCourses;
    }).then(filteredCourses => {
      return filteredCourses.map((offering) => {
        let remoteTag = offering.campus === "Remote" ? "(Remote)" : ""
        if (offering.courseType === '36 Week Part-Time Immersive' && offering.campus === "Remote") remoteTag = "(Remote Part-Time)"
       return {
         value: offering.courseName,
         name: `${moment(offering.startDate).format('MMM DD, YYYY')} ${remoteTag}`
       };
     });
    })

  return offerings;
};

export const APPLICATION_INPUTS = [{
    name: 'Software Engineering Immersive',
    courseProduct: 'Full Stack',
    courseType: '12 Week Full-Time Immersive',
    formFields: [{
      id: 'campus',
      label: 'Where are you planning to take this course? *',
      type: 'select',
      fieldName: 'Campus__c',
      value: '',
      validate: ["string"],
      errorMsg: "Please select a valid campus",
      options: CAMPUSES
    }, {
      id: 'course-dates',
      label: 'When would you like to take this course? *',
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
      label: 'Date of Birth *',
      fieldName: 'Birthdate__c',
      type: 'text',
      value: '',
      validate: ["birthday"],
      errorMsg: "Please use a proper MM/DD/YYYY format.",
      cleave: true
    },  {
      id: 'education',
      label: 'Highest level of Education Completed *',
      type: 'select',
      fieldName: 'Highest_Degree__c',
      validate: ["string"],
      errorMsg: "Please select an option",
      value: '',
      options: [
        {
          name: 'High School/GED',
          value: 'High School/GED'
        },
        {
          name: 'High School Diploma',
          value: 'High School Diploma'
        },
        {
          name: '2-Year Degree',
          value: '2-Year Degree'
        },
        {
          name: '4-Year Degree',
          value: '4-Year Degree'
        },
        {
          name: 'Master\'s Degree',
          value: 'Master\'s Degree'
        },
        {
          name: 'Doctoral Degree',
          value: 'Doctoral Degree'
        }
      ]
    }, {
      id: 'coding-experience',
      label: 'Coding Experience in JavaScript *',
      type: 'select',
      validate: ["string"],
      errorMsg: "Please select an option",
      fieldName: 'Javascript__c',
      value: '',
      options: [{
          name: '(1) I do not have prior coding experience (and that is okay!)',
          value: 'I do not have prior coding experience'
        },
        {
          name: '(2) I can create variables and simple data structures',
          value: 'I can create variables and simple data structures'
        },
        {
          name: '(3) I can create conditional statements',
          value: 'I can create conditional statements'
        },
        {
          name: '(4) I can iterate through arrays and objects',
          value: 'I can iterate through arrays and objects'
        },
        {
          name: '(5) I can combine iteration and conditionals on nested arrays and objects',
          value: 'I can combine iteration and conditionals on nested arrays and objects'
        },
        {
          name: '(6) I have built a web application',
          value: 'I have built a web application'
        }
      ]
    },{
      id: 'linkedin',
      label: 'LinkedIn URL',
      validate: [],
      fieldName: 'LinkedIn__c',
      type: 'text',
      value: ''
    }, {
      id: 'other-experience',
      label: 'Other Coding Experience',
      validate: [],
      fieldName: 'If_Experience_Other__c',
      type: 'text',
      value: '',
      placeholder: 'Java, Python, etc'
    }, {
      id: 'why-applying',
      label: 'What is your motivating factor for learning Software Engineering? *',
      fieldName: 'Reason_applying_to_this_gSchool_Program__c',
      type: 'textarea',
      validate: ["150-1500-chars"],
      errorMsg: "Must have at least 150 characters",
      value: ''
    }, {
      id: 'ethnicity',
      label: 'What best describes your ethnicity? *',
      validate: ["string"],
      type: 'select',
      fieldName: 'EthnicityNew__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Hispanic/Latino',
          value: 'Hispanic/Latino'
        },
        {
          name: 'Non-Hispanic/Non-Latino',
          value: 'Non-Hispanic/Non-Latino'
        },
        {
          name: 'Prefer not to answer',
          value: 'Prefer not to answer'
        }
      ]
    }, {
      id: 'race',
      label: 'What best describes your race? *',
      type: 'select',
      validate: ["string"],
      fieldName: 'Race__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'American Indian or Alaskan Native',
          value: 'American Indian or Alaskan Native'
        },
        {
          name: 'Asian',
          value: 'Asian'
        },
        {
          name: 'Black or African American',
          value: 'Black or African American'
        },
        {
          name: 'White',
          value: 'White'
        },
        {
          name: 'Native Hawaiian or other Pacific Islander',
          value: 'Native Hawaiian or other Pacific Islander'
        },
        {
          name: 'Prefer not to answer',
          value: 'Prefer not to answer'
        }
      ]
    }, {
      id: 'gender',
      label: 'Gender *',
      type: 'select',
      fieldName: 'Gender__c',
      validate: ["string"],
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Male',
          value: 'Male'
        },
        {
          name: 'Female',
          value: 'Female'
        },
        {
          name: 'Non-binary',
          value: 'Non-binary'
        },
        {
          name: 'Prefer not to answer',
          value: 'Prefer not to answer'
        }
      ]
    }, {
      id: 'veteran',
      label: 'Are you a veteran of the U.S. Armed Forces? *',
      validate: ["string"],
      type: 'select',
      fieldName: 'Veteran__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Yes',
          value: 'true'
        },
        {
          name: 'No',
          value: 'false'
        }
      ]
    }, {
      id: 'lgbtq',
      label: 'Do you identify as a member of the LGBTQ community? *',
      validate: ["string"],
      type: 'select',
      fieldName: 'Identify_as_LGBTQ__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Yes',
          value: 'yes'
        },
        {
          name: 'No',
          value: 'no'
        },
        {
          name: 'Prefer not to answer',
          value: 'Prefer not to answer'
        }
      ]
    }, {
      id: 'dependent-of-veteran',
      label: `Are you a dependent of a U.S. Veteran? *`,
      validate: ["string"],
      type: 'select',
      fieldName: 'Dependent_of_Veteran__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Yes',
          value: 'true'
        },
        {
          name: 'No',
          value: 'false'
        }
      ]
    }, {
      id: 'is-international',
      label: 'Are you a U.S. Citizen or permanent resident? *',
      type: 'select',
      fieldName: 'US_Citizen_or_Permanent_Resident__c',
      value: '',
      validate: ["string"],
      errorMsg: "Please select an option",
      options: [{
          name: 'Yes',
          value: 'true'
        },
        {
          name: 'No',
          value: 'false'
        }
      ]
    }, {
      id: 'authorized',
      label: 'Are you authorized to work in the United States? *',
      type: 'select',
      fieldName: 'Authorize_to_work_in_US__c',
      errorMsg: "Please select an option",
      validate: ["string"],
      value: '',
      options: [{
          name: 'Yes',
          value: 'true'
        },
        {
          name: 'No',
          value: 'false'
        }
      ]
    }, {
      id: 'how-heard-about',
      label: 'How did you hear about Galvanize? *',
      validate: ["string"],
      type: 'select',
      fieldName: 'How_did_you_hear_about_gSchool__c',
      errorMsg: "Please select an option",
      value: '',
      options: [{
          name: 'Email / Newsletter',
          value: 'Email / Newsletter',
        },
        {
          name: 'Facebook',
          value: 'Facebook',
        }, {
          name: 'Former Galvanize Student',
          value: 'Former Galvanize Student',
        },
        {
          name: 'Internet Search',
          value: 'Internet Search',
        },
        {
          name: 'LinkedIn',
          value: 'LinkedIn',
        },
        {
          name: 'Meetup or Conference',
          value: 'Meetup or Conference',
        },
        {
          name: 'Employer / Colleague',
          value: 'Employer / Colleague',
        }, {
          name: 'Galvanize Event',
          value: 'Galvanize Event',
        },
        {
          name: 'Other',
          value: 'Other',
        },
      ]
    }, {
      id: 'galvanizer-name',
      label: 'If you were referred to Galvanize by a member of our community, please provide their name:',
      optional: true,
      validate: [],
      type: 'text',
      fieldName: 'If_gSchool_student_yes__c',
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
    }, {
      id: 'terms',
      label: 'not needed',
      fieldName: 'Terms',
      type: 'checkbox',
      validate: ['checked'],
      value: '',
      errorMsg: 'You must agree to our terms and conditions'
    }]
  },
  {
    name: 'Data Science Immersive',
    courseProduct: 'Data Science',
    courseType: '13 Week Full-Time Immersive',
    formFields: [{
        id: 'campus',
        label: 'Where are you planning to take this course? *',
        type: 'select',
        fieldName: 'Campus__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select a valid campus",
        options: CAMPUSES
      }, {
        id: 'course-dates',
        label: 'When would you like to take this course? *',
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
        label: 'Date of Birth *',
        fieldName: 'Birthdate__c',
        type: 'text',
        value: '',
        validate: ["birthday"],
        errorMsg: "Please use a proper MM/DD/YYYY format.",
        cleave: true
      }, {
        id: 'education',
        label: 'Highest level of Education Completed *',
        type: 'select',
        fieldName: 'Highest_Degree__c',
        validate: ["string"],
        errorMsg: "Please select an option",
        value: '',
        options: [
          {
            name: 'High School/GED',
            value: 'High School/GED'
          },
          {
            name: 'High School Diploma',
            value: 'High School Diploma'
          },
          {
            name: '2-Year Degree',
            value: '2-Year Degree'
          },
          {
            name: '4-Year Degree',
            value: '4-Year Degree'
          },
          {
            name: 'Master\'s Degree',
            value: 'Master\'s Degree'
          },
          {
            name: 'Doctoral Degree',
            value: 'Doctoral Degree'
          }
        ]
      }, {
        id: 'coding-experience',
        label: 'Python Experience *',
        type: 'select',
        validate: ["string"],
        errorMsg: "Please select an option",
        fieldName: 'How_much_experience_with_Python__c',
        value: '',
        options: [{
            name: '(1) I have little or no Python knowledge (and that’s okay)',
            value: 'I have little or no Python knowledge (and that’s okay)'
          },
          {
            name: '(2) I have learned some Python but am not yet confident with it',
            value: 'I have learned some Python but am not yet confident with it'
          },
          {
            name: '(3) I have used Python for personal/academic projects',
            value: 'I have used Python for personal/academic projects'
          },
          {
            name: '(4) I know and use Python professionally',
            value: 'I know and use Python professionally'
          }
        ]
      },{
        id: 'linkedin',
        label: 'LinkedIn URL',
        validate: [],
        fieldName: 'LinkedIn__c',
        type: 'text',
        value: ''
      },  {
        id: 'other-experience',
        label: 'Other Coding Experience',
        validate: [],
        fieldName: 'If_Experience_Other__c',
        type: 'text',
        value: '',
        placeholder: 'R, SQL, etc'
      }, {
        id: 'why-applying',
        label: 'What is your motivating factor for learning Data Science? *',
        fieldName: 'Reason_applying_to_this_gSchool_Program__c',
        type: 'textarea',
        validate: ["150-1500-chars"],
        errorMsg: "Must have at least 150 characters",
        value: ''
      }, {
        id: 'ethnicity',
        label: 'What best describes your ethnicity? *',
        validate: ["string"],
        type: 'select',
        fieldName: 'EthnicityNew__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Hispanic/Latino',
            value: 'Hispanic/Latino'
          },
          {
            name: 'Non-Hispanic/Non-Latino',
            value: 'Non-Hispanic/Non-Latino'
          },
          {
            name: 'Prefer not to answer',
            value: 'Prefer not to answer'
          }
        ]
      }, {
        id: 'race',
        label: 'What best describes your race? *',
        type: 'select',
        validate: ["string"],
        fieldName: 'Race__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'American Indian or Alaskan Native',
            value: 'American Indian or Alaskan Native'
          },
          {
            name: 'Asian',
            value: 'Asian'
          },
          {
            name: 'Black or African American',
            value: 'Black or African American'
          },
          {
            name: 'White',
            value: 'White'
          },
          {
            name: 'Native Hawaiian or other Pacific Islander',
            value: 'Native Hawaiian or other Pacific Islander'
          },
          {
            name: 'Prefer not to answer',
            value: 'Prefer not to answer'
          }
        ]
      }, {
        id: 'gender',
        label: 'Gender *',
        type: 'select',
        fieldName: 'Gender__c',
        validate: ["string"],
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Male',
            value: 'Male'
          },
          {
            name: 'Female',
            value: 'Female'
          },
          {
            name: 'Non-binary',
            value: 'Non-binary'
          },
          {
            name: 'Prefer not to answer',
            value: 'Prefer not to answer'
          }
        ]
      }, {
        id: 'veteran',
        label: 'Are you a veteran of the U.S. Armed Forces? *',
        validate: ["string"],
        type: 'select',
        fieldName: 'Veteran__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Yes',
            value: 'true'
          },
          {
            name: 'No',
            value: 'false'
          }
        ]
      }, {
        id: 'lgbtq',
        label: 'Do you identify as a member of the LGBTQ community? *',
        validate: ["string"],
        type: 'select',
        fieldName: 'Identify_as_LGBTQ__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Yes',
            value: 'yes'
          },
          {
            name: 'No',
            value: 'no'
          },
          {
            name: 'Prefer not to answer',
            value: 'Prefer not to answer'
          }
        ]
      }, {
        id: 'dependent-of-veteran',
        label: `Are you a dependent of a U.S. Veteran? *`,
        validate: ["string"],
        type: 'select',
        fieldName: 'Dependent_of_Veteran__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Yes',
            value: 'true'
          },
          {
            name: 'No',
            value: 'false'
          }
        ]
      }, {
        id: 'is-international',
        label: 'Are you a U.S. Citizen or permanent resident? *',
        type: 'select',
        fieldName: 'US_Citizen_or_Permanent_Resident__c',
        value: '',
        validate: ["string"],
        errorMsg: "Please select an option",
        options: [{
            name: 'Yes',
            value: 'true'
          },
          {
            name: 'No',
            value: 'false'
          }
        ]
      }, {
        id: 'authorized',
        label: 'Are you authorized to work in the United States? *',
        type: 'select',
        fieldName: 'Authorize_to_work_in_US__c',
        errorMsg: "Please select an option",
        validate: ["string"],
        value: '',
        options: [{
            name: 'Yes',
            value: 'true'
          },
          {
            name: 'No',
            value: 'false'
          }
        ]
      }, {
        id: 'how-heard-about',
        label: 'How did you hear about Galvanize? *',
        validate: ["string"],
        type: 'select',
        fieldName: 'How_did_you_hear_about_gSchool__c',
        errorMsg: "Please select an option",
        value: '',
        options: [{
            name: 'Email / Newsletter',
            value: 'Email / Newsletter',
          },
          {
            name: 'Facebook',
            value: 'Facebook',
          }, {
            name: 'Former Galvanize Student',
            value: 'Former Galvanize Student',
          },
          {
            name: 'Internet Search',
            value: 'Internet Search',
          },
          {
            name: 'LinkedIn',
            value: 'LinkedIn',
          },
          {
            name: 'Meetup or Conference',
            value: 'Meetup or Conference',
          },
          {
            name: 'Employer / Colleague',
            value: 'Employer / Colleague',
          }, {
            name: 'Galvanize Event',
            value: 'Galvanize Event',
          },
          {
            name: 'Other',
            value: 'Other',
          },
        ]
      }, {
        id: 'galvanizer-name',
        label: 'If you were referred to Galvanize by a member of our community, please provide their name:',
        optional: true,
        validate: [],
        type: 'text',
        fieldName: 'If_gSchool_student_yes__c',
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
      {
        id: 'terms',
        label: 'not needed',
        fieldName: 'Terms',
        type: 'checkbox',
        validate: ['checked'],
        value: '',
        errorMsg: 'You must agree to our terms and conditions'
      }
    ]
  }
]
