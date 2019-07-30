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
   Javascript__c: {
     Opportunity: 'Javascript__c'
   },
   How_much_experience_with_Python__c: {
     Opportunity: 'How_much_experience_with_Python__c'
   },
   If_Experience_Other__c: {
     Opportunity: 'If_Experience_Other__c'
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
     Contact: 'EthnicityNew__c',
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
   },
   How_did_you_hear_about_gSchool__c: {
     Contact: 'Referral_Source__c'
   },
   If_gSchool_student_yes__c: {
     Contact: 'Referred_by_Name__c',
   },
   Authorize_to_work_in_US__c: {
     Contact: 'Authorize_to_work_in_US__c',
   },

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

 function prepLeadParamsforSFDC(formParams) {
   if (formParams.Birthdate__c) {
     let bDayParts = formParams.Birthdate__c.split('/');
     let formattedBDay = `${ bDayParts[2] }-${ bDayParts[0] }-${ bDayParts[1] }`;
     formParams.Birthdate__c = formattedBDay;
   }

   if (formParams.Product__c === 'Web Development' || formParams.Product__c === 'Full Stack') {
     formParams.Product__c = 'Full Stack';
     formParams.Course_to_which_you_are_applying__c = 'Full Stack Immersive';
   } else if (formParams.Product__c === 'Data Science') {
     formParams.Course_to_which_you_are_applying__c = 'Data Science Immersive';
   }

   if (formParams.If_gSchool_student_yes__c) formParams.Where_you_referred_by_a_gSchool_student__c = 'Yes'

   delete formParams['Is_Eighteen'];
   delete formParams['Terms'];
   delete formParams['Valid_Information'];
   return formParams;
 }


 export default {
   reformatBirthday,
   reformatCourseToWhichApplying,
   normalizeAustin,
   prepLeadParamsforSFDC,
   salesforceFieldSanitizer
 };
