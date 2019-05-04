export const GALVANIZE_BASE_URL = 'https://www.galvanize.com';
export const INFO_SESSION_SEI_URL = 'https://www.hackreactor.com/campus-tours-and-info-sessions';
export const INFO_SESSION_DSI_URL = 'https://www.galvanize.com/events/info-sessions/data-science';
export const CAMPUS_TOUR_SEI_URL = 'https://www.hackreactor.com/campus-tours-and-info-sessions';
export const CAMPUS_TOUR_DSI_URL = 'https://www.galvanize.com/events/info-sessions/data-science';
export const TECH_INTERVIEW_SEI_URL = 'https://www.galvanize.com/web-development/interview';
export const TECH_INTERVIEW_DSI_URL = 'https://www.galvanize.com/data-science/interview';
export const PREP_SEI_URL = 'https://www.galvanize.com/web-development/prep';
export const PREP_DSI_URL = 'https://www.galvanize.com/data-science/prep';

export const CODE_CHALLENGE_ENDPOINT = '/api/v1/user/code-submit';
export const PYTHON_CODE_SUBMIT_ENDPOINT = '/api/v1/user/python-submit';
export const UPDATE_OPP_ENDPOINT = '/api/v1/user/update-opp-stage';
export const UPDATE_SCORECARD_ENDPOINT = '/api/v1/user/update-scorecard';
export const PYTHON_CHALLENGE_ENDPOINT = '/api/v1/assessments';

export const PROSPECT_RECORD_ID = '012j00000004QndAAE';
export const STUDENT_RECORD_ID = '012j0000000kfkDAAQ';
export const SF_WDI_SYLLABUS_CAMPAIGN_ID = process.env.SF_WDI_SYLLABUS_CAMPAIGN_ID;
export const SF_WDI_APPLICATION_CAMPAIGN_ID = process.env.SF_WDI_APPLICATION_CAMPAIGN_ID;
export const SF_DSI_SYLLABUS_CAMPAIGN_ID = process.env.SF_DSI_SYLLABUS_CAMPAIGN_ID;
export const SF_DSI_APPLICATION_CAMPAIGN_ID = process.env.SF_DSI_APPLICATION_CAMPAIGN_ID;
export const SF_NEWSLETTER_CAMPAIGN_ID = process.env.SF_NEWSLETTER_CAMPAIGN_ID;

export const CAMPUSES = [
  { name: 'austin',
    optionName: 'Austin, TX', // used in select dropdowns
    lat: '30.26532630000001',
    lon: '-97.74954989999998',
    city: 'Austin',
    state: 'TX',
    dsi: true,
    wdi: false,
    sfdcName: 'Austin-2nd St District',
    ycbmLink: 'https://atx-interviews.youcanbook.me',
    ycbmId:'ycbmiframeatx-interviews',
    location: '2nd Street District'
  },
  { name: 'boulder',
    optionName: 'Boulder, CO',
    lat: '40.0165447',
    lon: '-105.28168599999998',
    city: 'Boulder',
    state: 'CO',
    dsi: true,
    wdi: true,
    sfdcName: 'Boulder-Walnut St.',
    ycbmLink: 'https://agn-interviews.youcanbook.me',
    ycbmId:'ycbmiframeagn-interviews',
    location: 'Walnut'
  },
  { name: 'denver-platte',
    optionName: 'Denver, CO',
    lat: '39.75766149999999',
    lon: '-105.00695439999998',
    city: 'Denver',
    state: 'CO',
    dsi: true,
    wdi: true,
    sfdcName: 'Denver-Platte',
    ycbmLink: 'https://agn-interviews.youcanbook.me',
    ycbmId:'ycbmiframeagn-interviews',
    location: 'Platte'
  },
  { name: 'new-york',
    optionName: 'New York, NY',
    lat: '40.7263875',
    lon: '-74.00779190000003',
    city: 'New York',
    state: 'NY',
    dsi: true,
    wdi: false,
    sfdcName: 'NYC-SoHo',
    ycbmLink: 'https://nyc-interviews.youcanbook.me',
    ycbmId:'ycbmiframenyc-interviews',
    location: 'West SoHo'
  },
  { name: 'phoenix',
    optionName: 'Phoenix, AZ',
    lat: '33.439984',
    lon: '-112.066826',
    city: 'Phoenix',
    state: 'AZ',
    dsi: true,
    wdi: true,
    sfdcName: 'Phoenix-Warehouse District',
    ycbmLink: 'https://agn-interviews.youcanbook.me',
    ycbmId:'ycbmiframeagn-interviews',
    location: 'Warehouse District'
  },
  { name: 'los-angeles',
    optionName: 'Los Angeles, CA',
    lat: '33.976037',
    lon: '-118.390798',
    city: 'Los Angeles',
    state: 'CA',
    dsi: true,
    wdi: true,
    sfdcName: 'Los Angeles',
    ycbmLink: 'https://la-interviews.youcanbook.me',
    ycbmId:'ycbmiframela-interviews',
    location: 'Los Angeles'
  },
  { name: 'san-francisco',
    optionName: 'San Francisco, CA',
    lat: '37.7875728',
    lon: '-122.39658180000004',
    city: 'San Francisco',
    state: 'CA',
    dsi: true,
    wdi: false,
    sfdcName: 'San Francisco-SoMa',
    ycbmLink: 'https://sf-interviews.youcanbook.me',
    ycbmId:'ycbmiframesf-interviews',
    location: 'SoMa'
  },
  { name: 'seattle',
    optionName: 'Seattle, WA',
    lat: '47.5990943',
    lon: '-122.33370980000001',
    city: 'Seattle',
    state: 'WA',
    dsi: true,
    wdi: true,
    sfdcName: 'Seattle-Pioneer Square',
    ycbmLink: 'https://agn-interviews.youcanbook.me',
    ycbmId:'ycbmiframeagn-interviews',
    location: 'Pioneer Square'
  },
  { name: 'remote',
    optionName: 'Remote',
    lat: '47.5990943',
    lon: '-122.33370980000001',
    city: 'Remote',
    state: 'Remote',
    dsi: true,
    wdi: true,
    sfdcName: 'Remote',
    ycbmLink: 'https://remote-interviews.youcanbook.me/',
    ycbmId:'ycbmiframeremote-interviews',
    location: 'Remote'
  }
];

export const FULL_TIME_PROGRAMS = [
  {
    name:'Data Science Immersive',
    sfdcName: 'Data Science'
    },{
    name:'Software Engineering Immersive',
    sfdcName: 'Software Engineering Immersive'
  },{
    name:'Software Engineering Remote Immersive',
    sfdcName: 'Software Engineering Remote Immersive'
  },{
    name:'Software Engineering Remote Part Time Immersive',
    sfdcName: 'Software Engineering Remote Part Time Immersive'
  }
];


export const CODING_CHALLENGE_TESTS = `describe("declaredAnArray", function() {
it("myArray is defined as an array", function() {
 expect(Array.isArray(myArray)).to.eq(true);
});
it("myArray has two strings", function() {
 expect(myArray.length).to.eq(2);
 expect(typeof(myArray[0])).to.eq('string');
 expect(typeof(myArray[1])).to.eq('string');
});
it("cutName is defined as a function", function() {
 expect(cutName).to.not.eq(undefined);
 expect(typeof(cutName)).to.eq('function');
});
it("cutName splits strings", function() {
 expect(cutName('Bob Bobson')).to.eql(['Bob', 'Bobson']);
 expect(cutName('Romeo Alpha Nancy Delta')).to.eql(['Romeo', 'Alpha', 'Nancy', 'Delta']);
});
it("myInfo is defined as an object", function() {
 expect(myInfo).to.be.an('object');
});
it("myInfo.fullName is the same as cutName(myArray[0])", function() {
 expect(myInfo.fullName).to.eql(cutName(myArray[0]));
});
it("myInfo.skype should equal myArray[1]", function() {
 expect(myInfo.skype).to.eql(myArray[1]);
 expect(myInfo.skype).to.be.an('string');
});
it("myInfo.github is defined as a string or null", function() {
 expect(myInfo).to.be.an('object');
 expect(myInfo.github).to.satisfy(function(s){
     return s === null || typeof s == 'string'
 });
});
});`;

export const HERO_TEXT = {
  DASHBOARD: {
    heroHeadline: 'Admissions Portal Dashboard',
    heroDescription: 'Manage your application, see next steps and complete the admissions process from here.'
  },
  CODING_CHALLENGE: {
    heroHeadline: 'Pass the Coding Challenge',
    heroDescription: "This quick coding challenge will test your understanding of basic JavaScript syntax and start you on your admissions journey. If you're new to programming or JavaScript, don't be deterred. Try this challenge as many times as you need - your application will not be affected by errors. Submit your code when completed. Best of luck!"
  },
  PYTHON_CHALLENGE: {
    heroHeadline: 'Pass the Coding Challenge',
    heroDescription: "This coding challenge is made up of two questions that will test your understanding of basic Python and start you on your admissions journey. Test your code as many times as you need.  Submit your code at the bottom when both challenges are completed. Best of luck!"
  },
  SEI_BOOK_INTERVIEW: {
    heroHeadline: 'Book the Technical Interview',
    heroDescription: "All campuses share the same interview format and assessment rubric so you can interview at the location that's most convenient for you, regardless of your preferred campus."
  }
};

export const SEI_STEPS_12_WK = {
  STEP_ONE: {
    step: 1,
    status: 'Complete Your Application'
  },
  STEP_TWO: {
    step: 2,
    status: 'Pass the Coding Challenge',
    description: 'Click to review the JavaScript coding challenge question prior to beginning your assessment. There is no limit to how many times you can attempt this challenge.  After passing the challenge, submit your code to continue the admissions process for this program.',
    buttonPath: '/coding-challenge',
    buttonText: 'Begin Coding Challenge'
  },
  STEP_THREE: {
    step: 3,
    status: 'Book the Technical Interview',
    description: 'Choose a time to complete your technical interview. Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing JavaScript fundamentals on your own.',
    buttonPath: '/book-interview',
    buttonText: 'Schedule Your Interview',
    blockClass:'-blue'
  },
  STEP_FOUR: {
    step: 4,
    status: 'Pass the Technical Interview',
    description: 'Your interview is booked! Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.',
    alertText: 'Need to cancel your interview?  Refer to your booking confirmation email.'
  },
  COMPLETE: {
    step: 5,
    status: 'Enroll',
    description: 'Congrats! You passed your technical interview.  Within one to two business days, you’ll receive an email containing your Student Enrollment Agreement. Review your Enrollment Agreement within seven days of receipt to confirm your cohort seat.',
    blockClass:'-green'
  },
  HOLD: {
    step: 0,
    status: 'Talk to Your Enrollment Officer',
    description: 'Reach out to your Enrollment Officer or admissions@galvanize.com for next steps in your admissions process.',
    buttonText: 'Email Us',
    buttonUrl: 'mailto:admissions@galvanize.com'
  }
};


export const SEI_STEPS_18_WK = {
  STEP_ONE: {
    step: 1,
    status: 'Complete Your Application'
  },
  STEP_TWO: {
    step: 1.5,
    status: 'FastTrack: Book the Technical Interview',
    description: 'Congrats! You passed the coding challenge!  In order to determine final eligibility for our FastTrack program - choose a time to complete your technical interview. Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing JavaScript fundamentals on your own.',
    buttonPath: '/book-interview',
    buttonText: 'Schedule the Technical Interview',
    override: true,
    hidden: true,
    blockClass:'-blue',
    alertText: 'We still recommend you do the Group Assessment even if you also attempt to FastTrack.'

  },
  STEP_THREE: {
    step: 1.75,
    status: 'FastTrack: Pass Your Technical Interview',
    description: 'Your FastTrack interview is booked! Prepare to pass your Technical Interview by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.  Note - You can still elect to follow the standard track and register for the group assessment during this time.  Reach out to your Enrollment Officer if you have any questions.',
    alertText: 'Need to cancel your interview?  Refer to your booking confirmation email.',
    hidden: true
  },
  STEP_FOUR: {
    step: 2,
    status: 'Register for the Group Assessment',
    description: 'Register for the Group Assessment via a link emailed from your Enrollment Officer.',
    buttonPath: '/coding-challenge',
    buttonText: 'FastTrack Coding Challenge',
    override: true,
    alertText: 'Want to see if you can do our accelerated FastTrack program?  Pass this coding challenge to be eligible for a final Technical Interview to get into FastTrack.'

  },
  STEP_FIVE: {
    step: 3,
    status: 'Pass the Group Assessment',
    description: 'You are registered for the Group Assessment! Prepare to pass the assessment by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.'
  },
  COMPLETE: {
    step: 6,
    status: 'Enroll',
    description: 'Congrats! You have passed.  Within one to two business days, you’ll receive an email containing your Student Enrollment Agreement. Review your Enrollment Agreement within seven days of receipt to confirm your cohort seat.',
    blockClass:'-green'
  },
  HOLD: {
    step: 0,
    status: 'Talk to Your Enrollment Officer',
    description: 'Reach out to your Enrollment Officer or admissions@galvanize.com for next steps in your admissions process.',
    buttonText: 'Email Us',
    buttonUrl: 'mailto:admissions@galvanize.com'
  }
};

export const DSI_STEPS = {
  STEP_ONE: {
    step: 1,
    status: 'Complete Your Application'
  },
  STEP_TWO: {
    step: 2,
    status: 'Pass the Coding Challenge',
    description: 'Click to review the Python coding challenge questions prior to beginning. There is no limit to how many times you can attempt this challenge.  After passing both, submit your code to continue the admissions process for this program.',
    buttonPath: '/python-challenge',
    buttonText: 'Begin Coding Challenge'
  },
  STEP_THREE: {
    step: 3,
    status: 'Book the Technical Interview',
    description: 'Choose a time to complete your technical interview. Prepare to pass your Technical Interview by enrolling in a Galvanize Data Science Prep course or by practicing Python fundamentals on your own.',
    buttonPath: '/book-interview',
    buttonText: 'Schedule Your Interview',
    blockClass:'-blue'
  },
  STEP_FOUR: {
    step: 4,
    status: 'Pass Your Technical Interviews',
    description: 'Reach out to your Enrollment Officer or admissions@galvanize.com for next steps in your admissions process.',
    buttonText: 'Email Us',
    buttonUrl: 'mailto:admissions@galvanize.com'
  },
  COMPLETE: {
    step: 5,
    status: 'Enroll',
    description: 'Reach out to your Enrollment Officer or admissions@galvanize.com for next steps in your admissions process.',
    buttonText: 'Email Us',
    buttonUrl: 'mailto:admissions@galvanize.com'
  },
  HOLD: {
    step: 0,
    status: 'Talk to Your Enrollment Officer',
    description: 'Reach out to your Enrollment Officer or admissions@galvanize.com for next steps in your admissions process.',
    buttonText: 'Email Us',
    buttonUrl: 'mailto:admissions@galvanize.com'
  }
};

export const APPLICATION_STEPS_SEI_12WK = [
  SEI_STEPS_12_WK.STEP_ONE,
  SEI_STEPS_12_WK.STEP_TWO,
  SEI_STEPS_12_WK.STEP_THREE,
  SEI_STEPS_12_WK.STEP_FOUR,
  SEI_STEPS_12_WK.COMPLETE,
  SEI_STEPS_12_WK.HOLD
];

export const APPLICATION_STEPS_SEI_18WK = [
  SEI_STEPS_18_WK.STEP_ONE,
  SEI_STEPS_18_WK.STEP_TWO,
  SEI_STEPS_18_WK.STEP_THREE,
  SEI_STEPS_18_WK.STEP_FOUR,
  SEI_STEPS_18_WK.STEP_FIVE,
  SEI_STEPS_18_WK.COMPLETE,
  SEI_STEPS_18_WK.HOLD
];

export const APPLICATION_STEPS_DSI = [
  DSI_STEPS.STEP_ONE,
  DSI_STEPS.STEP_TWO,
  DSI_STEPS.STEP_THREE,
  DSI_STEPS.STEP_FOUR,
  DSI_STEPS.COMPLETE,
  DSI_STEPS.HOLD
];

export const PLACEHOLDER_1 = `def consonant_first(text):
    """Finds a list of unique words in text that start with a consonant
    (letters that are not vowels). Note: all words are returned as
    lowercase and are returned in no particular order.

    Parameters
    ----------
    in_str: string
        A sentence containing no punctuation.
        E.g. "A dog is a good pet and a bear is an awful pet"

    Returns
    -------
    list of strings
        The words from the sentence that do not start with vowels
        ['a', 'e', 'i', 'o', 'u'].
        All strings are returned as lower case.

    Examples
    --------
    >>> consonant_first("A dog is a good pet and a bear is an awful pet")
    ["dog", "good", "pet", "bear"]
    """
    pass`;

export const PLACEHOLDER_2 = `def keys_geq_cutoff(num_dict, min_cutoff):
    """Returns all the keys (as a set) from num_dict that have
    value greater than or equal to min_cutoff.

    Parameters
    ----------
    num_dict: dictionary
    All the values in num_dict are numeric.
    min_cutoff: float
        Comparison with the num_dict values. Return all keys, where
        their values >= min_cutoff.

    Returns
    -------
    set
        All keys from num_dict whose values meet the cutoff criterion.

    Examples
    --------
    >>> keys_geq_cutoff({'Alice': 21, 'Brett': 20, 'Carlos': 31}, 21)
    {'Alice', 'Carlos'}
    """
    pass
`;

export const SNIPPET_1 = {
  id: 1,
  placeholder: PLACEHOLDER_1,
  question: "Complete the function 'consonant_first' according to its docstring."
};

export const SNIPPET_2 = {
  id: 2,
  placeholder: PLACEHOLDER_2,
  question: `You have some numeric data stored in a dictionary. The data could represent any number of things, for example, people's names and their height in inches, or cities and their populations. Complete the function below to return all the keys of the dictionary where their associated values are greater than or equal to some cutoff.`
};
