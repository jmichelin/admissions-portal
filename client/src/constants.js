export const GALVANIZE_BASE_URL = 'https://www.galvanize.com';
export const INFO_SESSION_SEI_URL = 'https://www.hackreactor.com/campus-tours-and-info-sessions';
export const INFO_SESSION_DSI_URL = 'https://www.galvanize.com/events/info-sessions/data-science';
export const CAMPUS_TOUR_SEI_URL = 'https://www.hackreactor.com/campus-tours-and-info-sessions';
export const CAMPUS_TOUR_DSI_URL = 'https://www.galvanize.com/events/info-sessions/data-science';
export const TECH_INTERVIEW_SEI_URL = 'https://www.galvanize.com/web-development/technical-admissions-assessment';
export const TECH_INTERVIEW_DSI_URL = 'https://www.galvanize.com/data-science/interview';
export const PREP_SEI_URL = 'https://www.galvanize.com/web-development/prep';
export const PREP_DSI_URL = 'https://www.galvanize.com/data-science/prep';
export const DSI_YCBM_CALENDAR_URL ='https://dsi-interviews.youcanbook.me';
export const DSI_YCBM_CALENDAR_ID = 'ycbmiframedsi-interviews';
export const CODE_CHALLENGE_ENDPOINT = '/api/v1/user/code-submit';
export const PYTHON_CHALLENGE_ENDPOINT = '/api/v1/assessments';
export const APPLICATIONS_ENDPOINT = '/api/v1/applications';
export const APPLICATION_INITIALIZE_ENDPOINT  = '/api/v1/applications/initialize';
export const PROSPECT_RECORD_ID = '012j00000004QndAAE';
export const STUDENT_RECORD_ID = '012j0000000kfkDAAQ';
export const SF_WDI_SYLLABUS_CAMPAIGN_ID = process.env.SF_WDI_SYLLABUS_CAMPAIGN_ID;
export const SF_WDI_APPLICATION_CAMPAIGN_ID = process.env.SF_WDI_APPLICATION_CAMPAIGN_ID;
export const SF_DSI_SYLLABUS_CAMPAIGN_ID = process.env.SF_DSI_SYLLABUS_CAMPAIGN_ID;
export const SF_DSI_APPLICATION_CAMPAIGN_ID = process.env.SF_DSI_APPLICATION_CAMPAIGN_ID;
export const SF_NEWSLETTER_CAMPAIGN_ID = process.env.SF_NEWSLETTER_CAMPAIGN_ID;
export const LEAD_SOURCE_COOKIE = 'fa-ad-source';

const DSI_IMMERSIVE = {
    courseName: 'Data Science',
    courseType: '13 Week Full-Time Immersive',
    courseProduct: 'Data Science'
  };

const SEI_IMMERSIVE = {
    courseName: 'Software Engineering',
    courseType: '12 Week Full-Time Immersive',
    courseProduct: 'Full Stack'
  };

const SEI_IMMERSIVE_EXTENDED = {
    courseName: 'Software Engineering',
    courseType: '18 Week Full-Time Immersive',
    courseProduct: 'Full Stack'
  };

const SEI_IMMERSIVE_PART_TIME = {
    courseName: 'Part-Time Software Engineering Immersive',
    courseType: '36 Week Part-Time Immersive',
    courseProduct: 'Full Stack'
  };

export const AVAILABLE_PROGRAMS = [DSI_IMMERSIVE, SEI_IMMERSIVE, SEI_IMMERSIVE_EXTENDED, SEI_IMMERSIVE_PART_TIME];

export const CAMPUSES = [
  {
    name: 'austin',
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
    location: '2nd Street District',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE]
  },
  {
    name: 'boulder',
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
    location: 'Walnut',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE_EXTENDED]
  },
  {
    name: 'denver-platte',
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
    location: 'Platte',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE_EXTENDED]
  },
  {
    name: 'new-york',
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
    location: 'West SoHo',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE]
  },
  {
    name: 'phoenix',
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
    location: 'Warehouse District',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE_EXTENDED]
  },
  {
    name: 'los-angeles',
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
    location: 'Los Angeles',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE]
  },
  {
    name: 'san-francisco',
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
    location: 'SoMa',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE]
  },
  {
    name: 'seattle',
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
    location: 'Pioneer Square',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE_EXTENDED]
  },
  {
    name: 'remote',
    optionName: 'Remote',
    lat: '47.5990943',
    lon: '-122.33370980000001',
    city: 'Remote',
    state: 'Remote',
    dsi: true,
    wdi: true,
    sfdcName: 'Remote',
    ycbmLink: 'https://remote-interviews.youcanbook.me',
    ycbmId:'ycbmiframeremote-interviews',
    location: 'Remote',
    programs: [DSI_IMMERSIVE, SEI_IMMERSIVE]
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
it("myInfo.favoriteColor should equal myArray[1]", function() {
 expect(myInfo.favoriteColor).to.eql(myArray[1]);
 expect(myInfo.favoriteColor).to.be.an('string');
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
    heroDescription: 'Start applications and complete the admissions process for each program from here.'
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
    heroHeadline: 'Book the Technical Admissions Assessment',
    heroDescription: ""
  },
  DSI_BOOK_INTERVIEW: {
    heroHeadline: 'Book the Technical Interview',
    heroDescription: ""
  }
};

export const SEI_STEPS_12_WK = {
  STEP_ONE: {
    step: 1,
    status: 'Complete Your Application',
    description: 'For the first step in the admissions process, please answer a few questions about yourself to complete your application for our Onsite, Remote, or Remote Part-Time Software Engineering programs. If you have any questions, reach out to us at admissions@galvanize.com.',
    buttonPath: '/application',
    buttonText: 'Complete Your Application',
    blockClass:'-grey'
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
    status: 'Book the Technical Admissions Assessment',
    description: 'Choose a time to take your Technical Admissions Assessment. Prepare to pass your assessment by enrolling in a Galvanize Software Engineering Prep course or by practicing JavaScript fundamentals on your own.',
    buttonPath: '/book-interview',
    buttonText: 'Schedule Your Assessment',
    blockClass:'-blue'
  },
  STEP_FOUR: {
    step: 4,
    status: 'Pass the Technical Admissions Assessment',
    description: 'Your interview is booked! Prepare to pass your Technical Admissions Assessment by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.',
    alertText: 'Need to cancel your interview?  Refer to your booking confirmation email.'
  },
  COMPLETE: {
    step: 5,
    status: 'Enroll',
    description: 'Congrats! You passed your technical assessment.  Within one to two business days, you’ll receive an email containing your Student Enrollment Agreement. Review your Enrollment Agreement within seven days of receipt to confirm your cohort seat.',
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
    status: 'Complete Your Application',
    description: 'For the first step in the admissions process, please answer a few questions about yourself to complete your application. If you have any questions, reach out to us at admissions@galvanize.com.',
    buttonPath: '/application',
    buttonText: 'Complete Your Application',
    blockClass:'-grey'
  },
  STEP_TWO: {
    step: 1.5,
    status: 'FastTrack: Book the Technical Admissions Assessment',
    description: 'Congrats! You passed the coding challenge!  In order to determine final eligibility for our FastTrack program - choose a time to complete your Technical Admissions Assessment. Prepare to pass your Technical Admissions Assessment by enrolling in a Software Engineering Prep course or by practicing JavaScript fundamentals on your own.',
    buttonPath: '/book-interview',
    buttonText: 'Schedule the Technical Admissions Assessment',
    override: true,
    hidden: true,
    blockClass:'-blue',
    alertText: 'We still recommend you do the Group Assessment even if you also attempt to FastTrack.'
  },
  STEP_THREE: {
    step: 1.75,
    status: 'FastTrack: Pass Your Technical Admissions Assessment',
    description: 'Your FastTrack interview is booked! Prepare to pass your Technical Admissions Assessment by enrolling in a Galvanize Software Engineering Prep course or by practicing the JavaScript fundamentals on your own.  Note - You can still elect to follow the standard track and register for the group assessment during this time.  Reach out to your Enrollment Officer if you have any questions.',
    alertText: 'Need to cancel your interview?  Refer to your booking confirmation email.',
    hidden: true
  },
  STEP_FOUR: {
    step: 2,
    status: 'Register for the Group Assessment',
    description: 'Register for the Group Assessment to continue your journey into this program. After registering, your Enrollment Officer will walk you through the rest of the admissions process.',
    buttonUrl: 'https://getcoding.hackreactor.com/hrext-assessment/',
    buttonText: 'Book Your Group Assessment',
    override: true,
    alertText: 'Want to see if you can do our accelerated FastTrack program? Pass a coding challenge to be eligible for a final Technical Admissions Assessment to get into FastTrack.',
    alertButtonPath: '/coding-challenge',
    alertButtonText: 'Try the Challenge'
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
    status: 'Complete Your Application',
    description: 'For the first step in the admissions process, please answer a few questions about yourself to finish completing your application. If you have any questions, reach out to us at admissions@galvanize.com.',
    buttonPath: '/application',
    buttonText: 'Complete Your Application',
    blockClass:'-grey'
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
    buttonPath: 'book-interview-dsi',
    buttonText: 'Schedule Your Interview',
    blockClass:'-blue'
  },
  STEP_FOUR: {
    step: 4,
    status: 'Pass the Technical Interview',
    description: 'Your interview is booked! Prepare to pass your Technical Interview by enrolling in a Galvanize Data Science Prep course or by practicing the Python fundamentals on your own.',
    alertText: 'Need to cancel your interview?  Refer to your booking confirmation email.'
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
  SEI_STEPS_12_WK.HOLD,
];

export const APPLICATION_STEPS_SEI_18WK = [
  SEI_STEPS_18_WK.STEP_ONE,
  SEI_STEPS_18_WK.STEP_TWO,
  SEI_STEPS_18_WK.STEP_THREE,
  SEI_STEPS_18_WK.STEP_FOUR,
  SEI_STEPS_18_WK.STEP_FIVE,
  SEI_STEPS_18_WK.COMPLETE,
  SEI_STEPS_18_WK.HOLD,
];

export const APPLICATION_STEPS_DSI = [
  DSI_STEPS.STEP_ONE,
  DSI_STEPS.STEP_TWO,
  DSI_STEPS.STEP_THREE,
  DSI_STEPS.STEP_FOUR,
  DSI_STEPS.COMPLETE,
  DSI_STEPS.HOLD,
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

export const PLACEHOLDER_3 = `def rec_dig_sum(n):
    '''
    Returns the recursive digit sum of an integer.

    Parameter
    ---------
    n: int

    Returns
    -------
    rec_dig_sum: int
       the recursive digit sum of the input n
    '''
    pass


def distr_of_rec_digit_sums(low=0, high=1500):
    '''
    Returns a dictionary representing the counts
    of recursive digit sums within a given range.

    Parameters
    ----------
    low: int
        a positive integer representing the lowest
        value in the range of integers for which finding
        the recursive digit sum
    high: int
        a positive integer greater than low, the inclusive
        upper bound for which finding the recursive digit sum

    Returns
    -------
    dict_of_rec_dig_sums: {int:int}
        returns a dictionary where the keys are the recursive
        digit sums and the values are the counts of those digit sums
        occurring
    '''
    pass
`;

export const PLACEHOLDER_4 = `def sigmoid(x):
    '''
    Returns the result of passing a number into the sigmoid
    logistic function. Assumes the value of e to be 2.71828

    Parameters
    ----------
    x: number
        the number to pass into the sigmoid logistic function

    Returns
    -------
    result: number
        result of the sigmoid logistic function
    '''
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

export const SNIPPET_3 = {
  id: 3,
  placeholder: PLACEHOLDER_3,
  question: "Write the function according to the doc string."
};

export const SNIPPET_4 = {
  id: 4,
  placeholder: PLACEHOLDER_4,
  question: `Write the function according to the doc string.`
};

export const PROGRAM_SELECT_TEXT = {
  headlineText: 'Start a New Application',
  noApplicationsText: "Looks like you don't have any active applications for a course starting in the future. Select a program and campus below to start your application:",
  existingApplicationsText: "Want to apply for a different program? Start a new application here to get started.  If you have an existing application for the same program please continue your application above.",
  heroDescription: 'Manage your application, see next steps and complete the admissions process from here.',
  citationText1: "Once you submit an application you can proceed within this portal to complete the next step in your program's admissions process.",
};
export const SUPPORT_ERROR_MESSAGE = "Uh oh! There was a processing error. Please contact support@galvanize.com"

export const CAMPUSES_SEI_18WK = ['Phoenix-Warehouse District', 'Seattle-Pioneer Square', 'Boulder-Walnut St.'];

export const OPPTY_PAST_INTERVIEW_STAGES = ['Interview 1 Scheduled', 'Offer Out', 'Offer Out - Needs Transcript', 'Contract Out', 'Accepted', 'Deposit Paid', 'Expired SEA', 'Needs New Contract', 'Enrolled'];
