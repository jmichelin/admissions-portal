 export const fieldsByUserType = {
   Campus__c: {
     Contact: 'Campus__c',
     Opportunity: 'Campus__c',
     DataClean: normalizeAustin
   },
   Product__c: {
     Contact: 'Product__c',
   },
   Which_dates_you_prefer_to_take_course__c: {
     Opportunity: 'Which_dates_you_prefer_to_take_course__c'
   },
   Course_to_which_you_are_applying__c: {
     Opportunity: 'Course_to_which_you_are_applying__c',
   },
   LinkedIn__c: {
     Contact: 'LinkedIn_Username__c',
   },
   Gender__c: {
     Contact: 'gender__c',
   },
   Identify_as_LGBTQ__c: {
     Contact: 'Identify_as_LGBTQ__c',
   },
   EthnicityNew__c: {
     Contact: 'Race__c',
   },
   Race__c: {
     Contact: 'Race__c',
   },
   Birthdate__c: {
     Contact: 'Birthdate',
     DataClean: reformatBirthday
   },
   Highest_Degree__c: {
     Contact: 'Highest_Degree__c',
   },
   Veteran__c: {
     Contact: 'US_Veteran__c',
   },
   Reason_applying_to_this_gSchool_Program__c: {
     Opportunity: 'Reason_applying_to_this_gSchool_Program__c'
   },
   International__c: {
     Contact: 'US_Citizen_or_Permanent_Resident__c',
   },
   Dependent_of_Veteran__c: {
     Contact: 'Dependent_of_Veteran__c',
   }
   // How_did_you_hear_about_gSchool__c: {
   //   Contact: 'contact',
   //   Opportunity: 'Contact__c__c'
   // },
   // If_gSchool_student_yes__c: {
   //   Contact: 'contact',
   //   Opportunity: 'Contact__c__c'
   // },
   // Authorize_to_work_in_US__c: {
   //   Contact: 'contact',
   //   Opportunity: 'Contact__c__c'
   // },

 };

 function salesforceFieldSanitizer(values, userType) {
  if (userType === 'Lead' || (userType !== 'Contact' && userType !== 'Opportunity')) return values;

  const sanitizedFields = {};
      Object.entries(values).forEach(([key, value]) => {
        if (fieldsByUserType[key] && fieldsByUserType[key][userType]) {
          if (fieldsByUserType[key].DataClean) {
            sanitizedFields[fieldsByUserType[key][userType]] = fieldsByUserType[key].DataClean(value)
          } else {
            sanitizedFields[fieldsByUserType[key][userType]] = value
          }
        }
      });

  return sanitizedFields;
}

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
   prepFormParamsForSFDC,
   salesforceFieldSanitizer
 };
