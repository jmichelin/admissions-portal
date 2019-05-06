import React from 'react';

import DSILogo from '../assets/images/galvanize_data_science_white.png';
import SEILogo from '../assets/images/HR_SEI_logo_white_horizontal.png'

export default (props) => {

  return (
    <div className="portal-aside">
      <div className="program-block">
        <img className="program-logo" alt="" src={SEILogo}></img>
        <p>Manage your application, complete your coding challenge and book your technical interview to complete the Software Engineering admissions process.</p>
      </div>
      <div className="program-block">
        <img className="program-logo -dsi" alt="" src={DSILogo}></img>
        <p>Manage your application, complete your coding challenge and book your technical interview to complete the Data Science admissions process.</p>
      </div>

      <div className="program-block -campuses">
        <span className="campus-line">Austin <span>&bull;</span> Boulder <span>&bull;</span> Denver<span>&bull;</span>Los Angeles</span>
        <span className="campus-line">New York <span>&bull;</span> Phoenix<span>&bull;</span> San Francisco <span>&bull;</span> Seattle <span>&bull;</span> Remote</span>
        <span className="campus-line"></span>
      </div>
    </div>
  )
}
