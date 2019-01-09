export const GALVANIZE_BASE_URL = 'https://www.galvanize.com';

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
