import React from 'react';

import DSILogo from '../assets/images/galvanize_data_science_white.png';
import SEILogo from '../assets/images/HR_SEI_logo_white_horizontal.png'

export default (props) => {

  return (
    <div className="portal-aside">
      <div className="program-block">
        <div className="logo-wrapper">
          <img className="program-logo" alt="" src={SEILogo}></img>
          <img className="program-logo -dsi" alt="" src={DSILogo}></img>
        </div>
          <p>From here you can start your application, pass the coding challenge, and book your technical interview to begin your journey of becoming a Software Engineer or a Data Scientist.  Take the leap!</p>
        </div>
      <div className="program-block -campuses">
        <span className="campus-line">Austin <span>&bull;</span> Boulder <span>&bull;</span> Denver<span>&bull;</span>Los Angeles</span>
        <span className="campus-line">New York <span>&bull;</span> Phoenix<span>&bull;</span> San Francisco <span>&bull;</span> Seattle <span>&bull;</span> Remote</span>
        <span className="campus-line"></span>
      </div>
    </div>
  )
}
