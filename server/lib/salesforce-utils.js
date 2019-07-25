 export const fieldsByUserType = {
  Contact__c: { Contact: 'contact', Oppty: 'Contact__c__c' },
  Birthday__c: { Contact: 'birthday', Oppty: 'Birthday__c__c' },
  Course__c: { Contact: 'course', Oppty: 'Course__c__c' },
};

function reformatBirthday(birthday) {
  let bDayParts = birthday.split('/');
  let formattedBDay = `${ bDayParts[2] }-${ bDayParts[0] }-${ bDayParts[1] }`;
  return formattedBDay;
}

function reformatCourseToWhichApplying(courseProduct) {
  if (courseProduct === 'Web Development') {
  courseProduct = 'Full Stack';
  formParams.Course_to_which_you_are_applying__c = 'Full Stack Immersive';
} else if (courseProduct === 'Data Science') {
  formParams.Course_to_which_you_are_applying__c = 'Data Science Immersive';
  }
  return courseProduct;
}

function normalizeAustin(campus) {
  let cleanCampus = campus === 'Austin-2nd St District' ? 'Austin-2nd Street District' : campus;
  return cleanCampus;
}

function prepFormParamsForSFDC(formParams) {
  if (formParams.Birthdate__c) {
    let bDayParts = formParams.Birthdate__c.split('/');
    let formattedBDay = `${ bDayParts[2] }-${ bDayParts[0] }-${ bDayParts[1] }`;
    formParams.Birthdate__c = formattedBDay;
  }

  if (formParams.Product__c === 'Web Development') {
    formParams.Product__c = 'Full Stack';
    formParams.Course_to_which_you_are_applying__c = 'Full Stack Immersive';
  } else if (formParams.Product__c === 'Data Science') {
    formParams.Course_to_which_you_are_applying__c = 'Data Science Immersive';
  }

  if (!formParams.Dependent_of_Veteran__c) {
    formParams.Dependent_of_Veteran__c === 'false'
  }
  if (formParamsIf_gSchool_student_yes__c) formParams.Where_you_referred_by_a_gSchool_student__c = 'Yes'
  // TODO: Get rid of coding experience delete
  delete formParams['Coding_Experience__c'];
  delete formParams['Is_Eighteen'];
  delete formParams['Terms'];
  delete formParams['Valid_Information'];
  return formParams;
}


export default {
  reformatBirthday,
  reformatCourseToWhichApplying,
  normalizeAustin,
  prepFormParamsForSFDC
};
