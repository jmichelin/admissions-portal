export const GALVANIZE_BASE_URL = 'https://www.galvanize.com';

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
    location: 'Remote'
  }
];

export const FULL_TIME_PROGRAMS = [
  {
  name:'Data Science Immersive',
  sfdcName: 'Data Science'
  },{
  name:'Software Engineering Immersive',
  sfdcName: 'Web Development'
},{
  name:'Software Engineering Remote Immersive',
  sfdcName: 'Web Development'
},{
  name:'Software Engineering Part Time Immersive',
  sfdcName: 'Web Development'
}]


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
});`
